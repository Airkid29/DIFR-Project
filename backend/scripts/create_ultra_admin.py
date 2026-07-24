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


def main():
    print("=" * 60)
    print("DFIR-Lab UltraAdmin User Creator")
    print("=" * 60)

    # Get user input
    name = input("Nom complet de l'UltraAdmin: ").strip()
    while not name:
        name = input("Le nom ne peut pas être vide. Nom complet: ").strip()

    email = input("Email de l'UltraAdmin: ").strip()
    while not email:
        email = input("L'email ne peut pas être vide. Email: ").strip()

    password = getpass("Mot de passe (ne sera pas affiché): ").strip()
    while len(password) < 8:
        print("Le mot de passe doit contenir au moins 8 caractères.")
        password = getpass("Mot de passe: ").strip()

    password_confirm = getpass("Confirmer le mot de passe: ").strip()
    while password != password_confirm:
        print("Les mots de passe ne correspondent pas.")
        password = getpass("Mot de passe: ").strip()
        password_confirm = getpass("Confirmer le mot de passe: ").strip()

    # Create user in database
    db = SessionLocal()
    try:
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"Erreur: Un utilisateur avec l'email {email} existe déjà !")
            sys.exit(1)

        # Create new user
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
        print(f"Utilisateur UltraAdmin créé avec succès !")
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
