import pyotp
from urllib.parse import quote


def generate_totp_secret() -> str:
    return pyotp.random_base32()


def get_totp_uri(secret: str, email: str, issuer: str = "Velora") -> str:
    account = quote(email)
    issuer_enc = quote(issuer)
    return f"otpauth://totp/{issuer_enc}:{account}?secret={secret}&issuer={issuer_enc}&digits=6&period=30&algorithm=SHA1"


def verify_totp_code(secret: str, code: str) -> bool:
    try:
        totp = pyotp.TOTP(secret)
        return totp.verify(code.strip(), valid_window=1)
    except Exception:
        return False
