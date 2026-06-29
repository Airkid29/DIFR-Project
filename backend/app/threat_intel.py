from typing import Any, Dict, List, Optional, Tuple

import requests
from sqlalchemy.orm import Session

from . import models


def get_integration_setting(db: Session, name: str) -> Optional[models.IntegrationSetting]:
    return db.query(models.IntegrationSetting).filter(models.IntegrationSetting.name == name).first()


def validate_virustotal_api_key(api_key: str) -> Dict[str, Any]:
    url = "https://www.virustotal.com/vtapi/v2/file/report"
    params = {
        "apikey": api_key,
        "resource": "44d88612fea8a8f36de82e1278abb02f",
    }
    response = requests.get(url, params=params, timeout=15)
    response.raise_for_status()
    data = response.json()
    return {
        "valid": data.get("response_code") in (0, 1),
        "response_code": data.get("response_code"),
        "verbose_msg": data.get("verbose_msg"),
    }


def validate_otx_api_key(api_key: str) -> Dict[str, Any]:
    url = "https://otx.alienvault.com/api/v1/users/me"
    response = requests.get(url, headers={"X-OTX-API-KEY": api_key}, timeout=15)
    response.raise_for_status()
    data = response.json()
    return {
        "valid": bool(data.get("username") or data.get("email")),
        "username": data.get("username"),
        "email": data.get("email"),
    }


def fetch_virustotal_hash_data(sha256_hash: str, api_key: str) -> Dict[str, Any]:
    url = "https://www.virustotal.com/vtapi/v2/file/report"
    params = {"apikey": api_key, "resource": sha256_hash}
    response = requests.get(url, params=params, timeout=20)
    response.raise_for_status()
    data = response.json()
    response_code = data.get("response_code", -1)
    positives = data.get("positives") or 0
    total = data.get("total") or 0
    return {
        "positives": positives,
        "total": total,
        "permalink": data.get("permalink"),
        "verbose_msg": data.get("verbose_msg"),
        "response_code": response_code,
        "found": response_code == 1,
    }


def fetch_otx_hash_data(sha256_hash: str, api_key: str) -> Dict[str, Any]:
    url = f"https://otx.alienvault.com/api/v1/indicators/file/{sha256_hash}/general"
    response = requests.get(url, headers={"X-OTX-API-KEY": api_key}, timeout=20)
    response.raise_for_status()
    data = response.json()
    pulse_info = data.get("pulse_info") or {}
    pulse_count = pulse_info.get("count", 0) if isinstance(pulse_info, dict) else 0
    return {
        "pulse_info": pulse_info,
        "pulse_count": pulse_count,
        "reputation": data.get("reputation"),
        "found": pulse_count > 0 or bool(data.get("base_indicator")),
    }


def lookup_hash_intel(db: Session, sha256_hash: str) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]], List[str]]:
    messages: List[str] = []
    virustotal_result = None
    otx_result = None

    vt_setting = get_integration_setting(db, "virustotal")
    otx_setting = get_integration_setting(db, "otx")

    if vt_setting and vt_setting.api_key:
        try:
            virustotal_result = fetch_virustotal_hash_data(sha256_hash, vt_setting.api_key)
            if virustotal_result["found"]:
                messages.append(
                    f"VirusTotal: {virustotal_result['positives']}/{virustotal_result['total']} engines flagged this hash."
                )
            else:
                messages.append("VirusTotal: hash not found in the database.")
        except Exception as exc:
            messages.append(f"VirusTotal lookup failed: {exc}")

    if otx_setting and otx_setting.api_key:
        try:
            otx_result = fetch_otx_hash_data(sha256_hash, otx_setting.api_key)
            pulse_count = otx_result.get("pulse_count", 0)
            if pulse_count > 0:
                messages.append(f"AlienVault OTX: {pulse_count} threat pulse(s) reference this hash.")
            else:
                messages.append("AlienVault OTX: no threat pulses found for this hash.")
        except Exception as exc:
            messages.append(f"OTX lookup failed: {exc}")

    if not virustotal_result and not otx_result:
        messages.append("No threat intelligence integrations are configured.")

    return virustotal_result, otx_result, messages


def intel_threat_boost(virustotal_result: Optional[Dict[str, Any]], otx_result: Optional[Dict[str, Any]]) -> int:
    boost = 0

    if virustotal_result and virustotal_result.get("found") and virustotal_result.get("positives", 0) > 0:
        positives = virustotal_result["positives"]
        total = max(virustotal_result.get("total") or 1, 1)
        boost += round((positives / total) * 55)

    if otx_result:
        pulse_count = otx_result.get("pulse_count", 0)
        boost += min(25, pulse_count * 5)

    return boost


def intel_rule_entries(
    virustotal_result: Optional[Dict[str, Any]],
    otx_result: Optional[Dict[str, Any]],
) -> List[Dict[str, Any]]:
    entries: List[Dict[str, Any]] = []

    if virustotal_result:
        entries.append({
            "rule": "ThreatIntel_VirusTotal",
            "meta": {
                "description": virustotal_result.get("verbose_msg") or "VirusTotal hash reputation lookup",
                "positives": virustotal_result.get("positives", 0),
                "total": virustotal_result.get("total", 0),
                "permalink": virustotal_result.get("permalink"),
                "found": virustotal_result.get("found", False),
            },
        })

    if otx_result:
        entries.append({
            "rule": "ThreatIntel_OTX",
            "meta": {
                "description": "AlienVault OTX community threat intelligence",
                "pulse_count": otx_result.get("pulse_count", 0),
                "reputation": otx_result.get("reputation"),
                "found": otx_result.get("found", False),
            },
        })

    return entries
