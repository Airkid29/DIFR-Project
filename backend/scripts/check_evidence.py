import os
import requests

BASE = os.getenv('FORNSIGUARD_API_URL', 'http://127.0.0.1:8000')
ADMIN_EMAIL = os.getenv('DEFAULT_ADMIN_EMAIL', 'r.jenkins@DFIR-Lab.com')
ADMIN_PASSWORD = os.getenv('DEFAULT_ADMIN_PASSWORD')

if not ADMIN_PASSWORD:
    raise SystemExit(
        'DEFAULT_ADMIN_PASSWORD must be set in the environment before running this script.'
    )

# Login
r = requests.post(
    f'{BASE}/api/auth/login',
    json={'email': ADMIN_EMAIL, 'password': ADMIN_PASSWORD},
)
print('login', r.status_code, r.text)
if r.status_code != 200:
    raise SystemExit('login failed')

token = r.json().get('access_token')
headers = {'Authorization': f'Bearer {token}'}

# GET evidence
g = requests.get(f'{BASE}/api/evidence', headers=headers)
print('GET /api/evidence', g.status_code)
print(g.text[:2000])

# Try to POST sample evidence
payload = {
    'name': 'Test file upload',
    'category': 'disk image',
    'sha256_hash': 'abc123def',
    'location': 'Lab collection box',
}

p = requests.post(f'{BASE}/api/evidence', json=payload, headers=headers)
print('POST /api/evidence', p.status_code)
print(p.text[:2000])
