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
        admin_email = "rachcode@forensiguard.com"
        admin = db.query(User).filter(User.email == admin_email).first()
        if not admin:
            hashed_pw = pwd_context.hash("securepassword123")
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
            print("[+] Seeded default administrator accounts.")
    except Exception as e:
        print(f"[-] Database seed failure: {e}")
    finally:
        db.close()
