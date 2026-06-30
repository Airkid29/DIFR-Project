import secrets
from typing import Any, Dict
from urllib.parse import urlencode

import requests
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from .config import settings
from . import models

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"

GITHUB_AUTH_URL = "https://github.com/login/oauth/authorize"
GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token"
GITHUB_USER_URL = "https://api.github.com/user"
GITHUB_EMAILS_URL = "https://api.github.com/user/emails"


def _oauth_state_token(provider: str) -> str:
    return jwt.encode(
        {"provider": provider, "nonce": secrets.token_urlsafe(16)},
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )


def verify_oauth_state(state: str, provider: str) -> bool:
    try:
        payload = jwt.decode(state, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload.get("provider") == provider
    except JWTError:
        return False


def get_oauth_authorization_url(provider: str, redirect_uri: str) -> Dict[str, str]:
    state = _oauth_state_token(provider)

    if provider == "google":
        if not settings.GOOGLE_CLIENT_ID:
            raise ValueError("Google OAuth n'est pas configuré sur le serveur.")
        params = {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": "openid email profile",
            "state": state,
            "access_type": "online",
            "prompt": "select_account",
        }
        return {"authorization_url": f"{GOOGLE_AUTH_URL}?{urlencode(params)}", "state": state}

    if provider == "github":
        if not settings.GITHUB_CLIENT_ID:
            raise ValueError("GitHub OAuth n'est pas configuré sur le serveur.")
        params = {
            "client_id": settings.GITHUB_CLIENT_ID,
            "redirect_uri": redirect_uri,
            "scope": "read:user user:email",
            "state": state,
        }
        return {"authorization_url": f"{GITHUB_AUTH_URL}?{urlencode(params)}", "state": state}

    raise ValueError("Fournisseur OAuth non pris en charge.")


def _exchange_google_code(code: str, redirect_uri: str) -> Dict[str, Any]:
    response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": redirect_uri,
            "grant_type": "authorization_code",
        },
        timeout=20,
    )
    response.raise_for_status()
    access_token = response.json().get("access_token")
    if not access_token:
        raise ValueError("Jeton Google introuvable.")

    profile = requests.get(
        GOOGLE_USERINFO_URL,
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=20,
    )
    profile.raise_for_status()
    data = profile.json()
    return {
        "provider": "google",
        "subject": str(data.get("id")),
        "email": data.get("email"),
        "name": data.get("name") or data.get("email", "Utilisateur Google"),
    }


def _exchange_github_code(code: str, redirect_uri: str) -> Dict[str, Any]:
    token_response = requests.post(
        GITHUB_TOKEN_URL,
        headers={"Accept": "application/json"},
        data={
            "client_id": settings.GITHUB_CLIENT_ID,
            "client_secret": settings.GITHUB_CLIENT_SECRET,
            "code": code,
            "redirect_uri": redirect_uri,
        },
        timeout=20,
    )
    token_response.raise_for_status()
    access_token = token_response.json().get("access_token")
    if not access_token:
        raise ValueError("Jeton GitHub introuvable.")

    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
    }
    profile = requests.get(GITHUB_USER_URL, headers=headers, timeout=20)
    profile.raise_for_status()
    data = profile.json()

    email = data.get("email")
    if not email:
        emails_response = requests.get(GITHUB_EMAILS_URL, headers=headers, timeout=20)
        emails_response.raise_for_status()
        for entry in emails_response.json():
            if entry.get("primary") and entry.get("verified"):
                email = entry.get("email")
                break
        if not email:
            for entry in emails_response.json():
                if entry.get("verified"):
                    email = entry.get("email")
                    break

    if not email:
        raise ValueError("Impossible de récupérer l'adresse e-mail GitHub.")

    return {
        "provider": "github",
        "subject": str(data.get("id")),
        "email": email,
        "name": data.get("name") or data.get("login") or email,
    }


def exchange_oauth_code(provider: str, code: str, redirect_uri: str) -> Dict[str, Any]:
    if provider == "google":
        return _exchange_google_code(code, redirect_uri)
    if provider == "github":
        return _exchange_github_code(code, redirect_uri)
    raise ValueError("Fournisseur OAuth non pris en charge.")


def upsert_oauth_user(db: Session, profile: Dict[str, Any]) -> models.User:
    provider = profile["provider"]
    subject = profile["subject"]
    email = profile["email"].lower().strip()
    name = profile["name"]

    user = (
        db.query(models.User)
        .filter(models.User.oauth_provider == provider, models.User.oauth_subject == subject)
        .first()
    )
    if user:
        user.name = name
        user.email = email
        user.is_active = True
        db.commit()
        db.refresh(user)
        return user

    existing_email = db.query(models.User).filter(models.User.email == email).first()
    if existing_email:
        if existing_email.oauth_provider and existing_email.oauth_provider != provider:
            raise ValueError("Cet e-mail est déjà associé à un autre mode de connexion.")
        existing_email.oauth_provider = provider
        existing_email.oauth_subject = subject
        existing_email.name = name
        existing_email.is_active = True
        db.commit()
        db.refresh(existing_email)
        return existing_email

    user = models.User(
        name=name,
        email=email,
        password_hash=None,
        oauth_provider=provider,
        oauth_subject=subject,
        role="Viewer",
        mfa_enabled=False,
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
