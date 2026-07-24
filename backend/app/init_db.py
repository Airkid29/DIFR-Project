import os
from sqlalchemy import inspect, text
from .database import engine, Base
from .models import User, Incident, Evidence, CustodyHistory, TimelineEvent, AuditLog, YaraJob, ActivityHistory, VisitorLog
from .config import settings
from .mfa import generate_totp_secret
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def migrate_schema():
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return

    columns = {col["name"] for col in inspector.get_columns("users")}
    dialect = engine.dialect.name

    with engine.begin() as conn:
        if "oauth_provider" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN oauth_provider VARCHAR(50)"))
        if "oauth_subject" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN oauth_subject VARCHAR(255)"))
        if "last_login" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN last_login TIMESTAMP"))
        if "account_type" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN account_type VARCHAR(50) DEFAULT 'professional'"))
        if "organization_name" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN organization_name VARCHAR(255)"))
        if "mfa_secret" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN mfa_secret VARCHAR(100)"))
        if "mfa_enabled" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN mfa_enabled BOOLEAN DEFAULT FALSE"))
        if "onboarding_completed" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN onboarding_completed BOOLEAN DEFAULT FALSE"))
        if "slack_webhook_url" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN slack_webhook_url VARCHAR(512)"))
        if "avatar_url" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN avatar_url VARCHAR(512)"))
        if "slack_webhook_incidents" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN slack_webhook_incidents VARCHAR(512)"))
        if "slack_webhook_evidence" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN slack_webhook_evidence VARCHAR(512)"))
        if "slack_webhook_audit" not in columns:
            conn.execute(text("ALTER TABLE users ADD COLUMN slack_webhook_audit VARCHAR(512)"))
        if dialect == "postgresql" and "password_hash" in columns:
            conn.execute(text("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL"))

    if "integration_settings" in inspector.get_table_names():
        is_cols = {col["name"] for col in inspector.get_columns("integration_settings")}
        with engine.begin() as conn:
            if "user_id" not in is_cols:
                conn.execute(text("ALTER TABLE integration_settings ADD COLUMN user_id INTEGER REFERENCES users(id)"))
                # Drop the old unique constraint on name, since now name can be duplicated per user
                try:
                    conn.execute(text("ALTER TABLE integration_settings DROP CONSTRAINT IF EXISTS integration_settings_name_key"))
                except Exception:
                    pass

    if "audit_logs" in inspector.get_table_names():
        audit_cols = {col["name"] for col in inspector.get_columns("audit_logs")}
        with engine.begin() as conn:
            if "organization_name" not in audit_cols:
                conn.execute(text("ALTER TABLE audit_logs ADD COLUMN organization_name VARCHAR(255)"))

    if "yara_jobs" in inspector.get_table_names():
        yara_cols = {col["name"] for col in inspector.get_columns("yara_jobs")}
        with engine.begin() as conn:
            if "user_id" not in yara_cols:
                conn.execute(text("ALTER TABLE yara_jobs ADD COLUMN user_id INTEGER REFERENCES users(id)"))
            if "organization_name" not in yara_cols:
                conn.execute(text("ALTER TABLE yara_jobs ADD COLUMN organization_name VARCHAR(255)"))

    if "incidents" in inspector.get_table_names():
        incident_cols = {col["name"] for col in inspector.get_columns("incidents")}
        with engine.begin() as conn:
            if "organization_name" not in incident_cols:
                conn.execute(text("ALTER TABLE incidents ADD COLUMN organization_name VARCHAR(255)"))

    if "evidence" in inspector.get_table_names():
        evidence_cols = {col["name"] for col in inspector.get_columns("evidence")}
        with engine.begin() as conn:
            if "organization_name" not in evidence_cols:
                conn.execute(text("ALTER TABLE evidence ADD COLUMN organization_name VARCHAR(255)"))
            if "incident_id" not in evidence_cols:
                conn.execute(text("ALTER TABLE evidence ADD COLUMN incident_id VARCHAR(50)"))
            if "owner_id" not in evidence_cols:
                conn.execute(text("ALTER TABLE evidence ADD COLUMN owner_id INTEGER"))
            if "attachment_path" not in evidence_cols:
                conn.execute(text("ALTER TABLE evidence ADD COLUMN attachment_path VARCHAR(512)"))
            if "status" not in evidence_cols:
                conn.execute(text("ALTER TABLE evidence ADD COLUMN status VARCHAR(50) DEFAULT 'verified'"))
            if "pending_custodian_id" not in evidence_cols:
                conn.execute(text("ALTER TABLE evidence ADD COLUMN pending_custodian_id INTEGER"))

def init_db():
    # Construct database schemas
    Base.metadata.create_all(bind=engine)
    migrate_schema()
    
    # Check if admin user exists, if not seed a default admin in non-production environments
    from .database import SessionLocal
    db = SessionLocal()
    try:
        default_password = (
            os.getenv("DEFAULT_ADMIN_PASSWORD", "securepassword123")
            if settings.APP_ENV != "production"
            else None
        )
        default_user_seeding = (
            settings.APP_ENV != "production"
            or os.getenv("SEED_DEFAULT_USERS", "false").lower() in ("1", "true", "yes")
        )
        if not default_user_seeding:
            default_password = None

        hashed_pw = pwd_context.hash(default_password) if default_password else None

        if not default_user_seeding:
            print("[*] Production mode detected. Skipping default user seeding.")

        # 1. Seed Robert Jenkins (Admin)
        admin_email = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@example.com")
        admin = db.query(User).filter(User.email == admin_email).first()
        if default_user_seeding and not admin:
            legacy_admin = db.query(User).filter(User.email == os.getenv("LEGACY_ADMIN_EMAIL", "")).first()
            if legacy_admin:
                legacy_admin.email = admin_email
                legacy_admin.password_hash = hashed_pw
                legacy_admin.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
                db.commit()
                print("[+] Updated legacy administrator email to the documented default.")
            else:
                admin_user = User(
                    name=os.getenv("DEFAULT_ADMIN_NAME", "Administrator"),
                    email=admin_email,
                    password_hash=hashed_pw,
                    role="Admin",
                    mfa_enabled=False,
                    is_active=True,
                    avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
                )
                db.add(admin_user)
                db.commit()
                print("[+] Seeded default administrator account.")
        elif admin:
            admin.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
            if default_password and not pwd_context.verify(default_password, admin.password_hash):
                admin.password_hash = hashed_pw
            db.commit()
            print("[+] Synced default administrator account.")

        # 2. Seed UltraAdmin
        ultra_email = os.getenv("ULTRA_ADMIN_EMAIL", "ultra@example.com")
        ultra = db.query(User).filter(User.email == ultra_email).first()
        if default_user_seeding and not ultra:
            ultra_user = User(
                name=os.getenv("ULTRA_ADMIN_NAME", "Ultra Administrator"),
                email=ultra_email,
                password_hash=hashed_pw,
                role="UltraAdmin",
                mfa_enabled=False,
                is_active=True,
                avatar_url="https://api.dicebear.com/7.x/avataaars/svg?seed=Ultra"
            )
            db.add(ultra_user)
            db.commit()
            print("[+] Seeded default UltraAdmin account.")
        elif ultra:
            ultra.avatar_url = "https://api.dicebear.com/7.x/avataaars/svg?seed=Ultra"
            if default_password and not pwd_context.verify(default_password, ultra.password_hash):
                ultra.password_hash = hashed_pw
            db.commit()
            print("[+] Synced default UltraAdmin account.")
            
    except Exception as e:
        print(f"[-] Database seed failure: {e}")
    finally:
        db.close()
