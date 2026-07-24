#!/usr/bin/env python3
"""Secure script to create the first UltraAdmin user in production."""

import os
import sys
from getpass import getpass

# Add the app directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal
from app.models import User
from app.main import pwd_context


def prompt_value(prompt: str, env_key: str, default: str | None = None, required: bool = True) -> str:
    value = os.getenv(env_key, default or "").strip()
    if value:
        return value

    if os.getenv("APP_ENV", "development").lower() == "production" and required:
        raise RuntimeError(
            f"Missing required environment variable {env_key}. "
            "Set it before running this bootstrap script in production."
        )

    while True:
        value = input(prompt).strip()
        if value:
            return value
        print("La valeur ne peut pas être vide.")


def prompt_password(env_key: str) -> str:
    password = os.getenv(env_key, "").strip()
    if password:
        return password

    app_env = os.getenv("APP_ENV", "development").lower()
    if app_env == "production":
        raise RuntimeError(
            f"Missing required environment variable {env_key}. "
            "Set ULTRA_ADMIN_PASSWORD before running in production."
        )

    while True:
        password = getpass("Mot de passe (ne sera pas affiché): ").strip()
        if len(password) >= 8:
            break
        print("Le mot de passe doit contenir au moins 8 caractères.")

    confirm = getpass("Confirmer le mot de passe: ").strip()
    while password != confirm:
        print("Les mots de passe ne correspondent pas.")
        password = getpass("Mot de passe: ").strip()
        confirm = getpass("Confirmer le mot de passe: ").strip()

    return password


def main():
    print("=" * 60)
    print("DFIR-Lab UltraAdmin User Creator")
    print("=" * 60)

    name = prompt_value("Nom complet de l'UltraAdmin: ", "ULTRA_ADMIN_NAME")
    email = prompt_value("Email de l'UltraAdmin: ", "ULTRA_ADMIN_EMAIL")
    password = prompt_password("ULTRA_ADMIN_PASSWORD")

    db = SessionLocal()
    try:
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"Erreur: Un utilisateur avec l'email {email} existe déjà !")
            sys.exit(1)

        hashed_password = pwd_context.hash(password)
        new_user = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            role="UltraAdmin",
            mfa_enabled=False,
            is_active=True,
            avatar_url=f"https://api.dicebear.com/7.x/avataaars/svg?seed={name.replace(' ', '')}"
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        print("\n" + "=" * 60)
        print("✓ SUCCÈS !")
        print("Utilisateur UltraAdmin créé avec succès !")
        print(f"  - ID: {new_user.id}")
        print(f"  - Nom: {new_user.name}")
        print(f"  - Email: {new_user.email}")
        print("\nIMPORTANT:")
        print("  - Connectez-vous immédiatement et activez l'authentification à deux facteurs (2FA) !")
        print("  - Ne stockez pas ce mot de passe dans un fichier !")
        print("=" * 60)

    except Exception as e:
        print(f"\nErreur lors de la création de l'utilisateur: {e}")
        db.rollback()
        sys.exit(1)
    finally:
        db.close()


if __name__ == "__main__":
    main()
