import hashlib
import base64
from typing import Any, Dict, List, Optional, Tuple

import requests
from urllib.parse import urlparse, quote
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


def _vt_get(api_key: str, url: str, params: Dict[str, str]) -> Dict[str, Any]:
    response = requests.get(url, params={**params, "apikey": api_key}, timeout=20)
    response.raise_for_status()
    return response.json()


def fetch_virustotal_url_data(url: str, api_key: str) -> Dict[str, Any]:
    resource = base64.urlsafe_b64encode(url.encode()).decode().strip("=")
    data = _vt_get(api_key, "https://www.virustotal.com/vtapi/v2/url/report", {"resource": resource})
    positives = data.get("positives") or 0
    total = data.get("total") or 0
    return {
        "positives": positives,
        "total": total,
        "permalink": data.get("permalink") or data.get("scan_id"),
        "verbose_msg": data.get("verbose_msg"),
        "response_code": data.get("response_code", -1),
        "found": data.get("response_code") == 1,
        "scan_date": data.get("scan_date"),
    }


def fetch_virustotal_domain_data(domain: str, api_key: str) -> Dict[str, Any]:
    data = _vt_get(api_key, "https://www.virustotal.com/vtapi/v2/domain/report", {"domain": domain})
    detected = data.get("detected_urls") or []
    positives = sum(item.get("positives", 0) for item in detected[:5])
    return {
        "domain": domain,
        "detected_urls": len(detected),
        "categories": data.get("categories") or {},
        "resolutions": data.get("resolutions") or [],
        "whois": (data.get("whois") or "")[:500],
        "found": data.get("response_code") == 1,
        "positives": positives,
        "verbose_msg": data.get("verbose_msg"),
    }


def fetch_virustotal_ip_data(ip: str, api_key: str) -> Dict[str, Any]:
    data = _vt_get(api_key, "https://www.virustotal.com/vtapi/v2/ip-address/report", {"ip": ip})
    detected = data.get("detected_urls") or []
    positives = sum(item.get("positives", 0) for item in detected[:5])
    return {
        "ip": ip,
        "country": data.get("country"),
        "as_owner": data.get("as_owner"),
        "detected_urls": len(detected),
        "resolutions": data.get("resolutions") or [],
        "found": data.get("response_code") == 1,
        "positives": positives,
        "verbose_msg": data.get("verbose_msg"),
    }


def lookup_indicator_intel(
    db: Session,
    indicator: str,
    indicator_type: str,
) -> Tuple[Optional[Dict[str, Any]], Optional[Dict[str, Any]], List[str]]:
    messages: List[str] = []
    virustotal_result = None
    otx_result = None
    indicator = indicator.strip()
    indicator_type = indicator_type.lower().strip()

    vt_setting = get_integration_setting(db, "virustotal")
    otx_setting = get_integration_setting(db, "otx")

    if indicator_type == "hash":
        if len(indicator) == 64:
            return lookup_hash_intel(db, indicator)
        messages.append("Le hash doit être un SHA-256 de 64 caractères hexadécimaux.")
        return None, None, messages

    if vt_setting and vt_setting.api_key:
        try:
            if indicator_type == "url":
                virustotal_result = fetch_virustotal_url_data(indicator, vt_setting.api_key)
                if virustotal_result["found"]:
                    messages.append(
                        f"VirusTotal URL : {virustotal_result['positives']}/{virustotal_result['total']} moteurs ont signalé cette URL."
                    )
                else:
                    messages.append("VirusTotal : URL introuvable dans la base.")
            elif indicator_type == "domain":
                virustotal_result = fetch_virustotal_domain_data(indicator, vt_setting.api_key)
                if virustotal_result["found"]:
                    messages.append(
                        f"VirusTotal domaine : {virustotal_result['detected_urls']} URL(s) malveillante(s) détectée(s)."
                    )
                else:
                    messages.append("VirusTotal : domaine introuvable dans la base.")
            elif indicator_type == "ip":
                virustotal_result = fetch_virustotal_ip_data(indicator, vt_setting.api_key)
                if virustotal_result["found"]:
                    messages.append(
                        f"VirusTotal IP : {virustotal_result['detected_urls']} URL(s) malveillante(s) associée(s)."
                    )
                else:
                    messages.append("VirusTotal : adresse IP introuvable dans la base.")
            else:
                messages.append(f"Type d'indicateur non supporté : {indicator_type}")
        except Exception as exc:
            messages.append(f"Recherche VirusTotal échouée : {exc}")
    else:
        messages.append("VirusTotal n'est pas configuré. Ajoutez votre clé API dans les paramètres.")

    if otx_setting and otx_setting.api_key and indicator_type in ("domain", "ip", "url"):
        try:
            # Normalize indicator for OTX API paths
            if indicator_type == "domain":
                parsed = urlparse(indicator)
                domain = parsed.netloc or parsed.path or indicator
                domain = domain.strip().lower()
                otx_indicator = domain
                otx_type = "domain"
            elif indicator_type == "ip":
                otx_indicator = indicator.strip()
                otx_type = "IPv4"
            else:
                # Quote the full URL so characters like ':' and '/' are safe in the path
                otx_indicator = quote(indicator, safe="")
                otx_type = "url"

            otx_url = f"https://otx.alienvault.com/api/v1/indicators/{otx_type}/{otx_indicator}/general"
            response = requests.get(otx_url, headers={"X-OTX-API-KEY": otx_setting.api_key}, timeout=20)
            response.raise_for_status()
            data = response.json()
            pulse_info = data.get("pulse_info") or {}
            pulse_count = pulse_info.get("count", 0) if isinstance(pulse_info, dict) else 0
            otx_result = {
                "pulse_count": pulse_count,
                "reputation": data.get("reputation"),
                "found": pulse_count > 0 or bool(data.get("base_indicator")),
            }
            if pulse_count > 0:
                messages.append(f"AlienVault OTX : {pulse_count} pulse(s) de menace référencent cet indicateur.")
            else:
                messages.append("AlienVault OTX : aucun pulse de menace trouvé.")
        except Exception as exc:
            messages.append(f"Recherche OTX échouée : {exc}")

    return virustotal_result, otx_result, messages
