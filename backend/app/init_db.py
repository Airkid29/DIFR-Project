from .database import engine, Base
from .models import User, Incident, Evidence, CustodyHistory, TimelineEvent, AuditLog, YaraJob
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def init_db():
    # Construct database schemas
    Base.metadata.create_all(bind=engine)
    
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
