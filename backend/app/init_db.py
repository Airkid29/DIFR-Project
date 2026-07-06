from sqlalchemy import inspect, text
from .database import engine, Base
from .models import User, Incident, Evidence, CustodyHistory, TimelineEvent, AuditLog, YaraJob, ActivityHistory
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
        if dialect == "postgresql" and "password_hash" in columns:
            conn.execute(text("ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL"))

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

def init_db():
    # Construct database schemas
    Base.metadata.create_all(bind=engine)
    migrate_schema()
    
    # Check if admin user exists, if not seed a default admin
    from .database import SessionLocal
    db = SessionLocal()
    try:
        admin_email = "r.jenkins@forensiguard.com"
        default_password = "securepassword123"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            # If old seeded admin still exists under a legacy email, update it.
            legacy_admin = db.query(User).filter(User.email == "rachcode@forensiguard.com").first()
            if legacy_admin:
                legacy_admin.email = admin_email
                legacy_admin.password_hash = pwd_context.hash(default_password)
                db.commit()
                print("[+] Updated legacy administrator email to the documented default.")
            else:
                hashed_pw = pwd_context.hash(default_password)
                admin_user = User(
                    name="Robert Jenkins",
                    email=admin_email,
                    password_hash=hashed_pw,
                    role="Admin",
                    mfa_secret="JBSWY3DPEHPK3PXP",  # Example static secret
                    mfa_enabled=True,
                    is_active=True
                )
                db.add(admin_user)
                db.commit()
                print("[+] Seeded default administrator account.")
        else:
            try:
                if not pwd_context.verify(default_password, admin.password_hash):
                    admin.password_hash = pwd_context.hash(default_password)
                    db.commit()
                    print("[+] Reset default administrator password.")
            except Exception:
                admin.password_hash = pwd_context.hash(default_password)
                db.commit()
                print("[+] Reset default administrator password after hash error.")
    except Exception as e:
        print(f"[-] Database seed failure: {e}")
    finally:
        db.close()
