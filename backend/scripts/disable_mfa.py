import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from app.database import SessionLocal
from app.models import User

db = SessionLocal()
try:
    u = db.query(User).filter(User.email == 'r.jenkins@DFIR-Lab.com').first()
    if not u:
        print('User not found')
    else:
        print('Before:', u.email, u.mfa_enabled, u.mfa_secret)
        u.mfa_enabled = False
        u.mfa_secret = None
        db.commit()
        print('Disabled MFA for user')
finally:
    db.close()
