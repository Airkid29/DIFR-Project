import importlib
import os
import hashlib
import yara
from fastapi.testclient import TestClient
from app.tasks import DEFAULT_YARA_RULES

def test_yara_compilation():
    # Verify the YARA rule signatures compile without syntax errors
    rules = yara.compile(source=DEFAULT_YARA_RULES)
    assert rules is not None

def test_file_hashing(tmp_path):
    # Verify exact hash calculation for static file content
    test_file = tmp_path / "suspicious.bin"
    test_content = b"ForensiGuard security test payload content."
    test_file.write_bytes(test_content)
    
    # Calculate md5, sha1, sha256
    md5 = hashlib.md5(test_content).hexdigest()
    sha1 = hashlib.sha1(test_content).hexdigest()
    sha256 = hashlib.sha256(test_content).hexdigest()
    
    # Compute using standard stream reader
    md5_test = hashlib.md5()
    sha1_test = hashlib.sha1()
    sha256_test = hashlib.sha256()
    
    with open(test_file, "rb") as f:
        while chunk := f.read(8192):
            md5_test.update(chunk)
            sha1_test.update(chunk)
            sha256_test.update(chunk)
            
    assert md5_test.hexdigest() == md5
    assert sha1_test.hexdigest() == sha1
    assert sha256_test.hexdigest() == sha256

def test_yara_matching(tmp_path):
    # Verify rules match cobaltstrike trigger strings
    rules = yara.compile(source=DEFAULT_YARA_RULES)
    test_file = tmp_path / "cobalt.bin"
    test_file.write_bytes(b"some headers here and there... lsass.exe string exists!")
    
    matches = rules.match(str(test_file))
    assert len(matches) > 0
    assert matches[0].rule == "CobaltStrike_Beacon_HTTPS"


def test_health_endpoint_allows_render_host(monkeypatch):
    monkeypatch.setenv("APP_ENV", "production")
    monkeypatch.setenv("SECRET_KEY", "test-secret")
    monkeypatch.setenv("ALLOWED_HOSTS", "localhost,127.0.0.1")

    import app.config
    import app.main

    importlib.reload(app.config)
    importlib.reload(app.main)

    with TestClient(app.main.app) as client:
        response = client.get("/health", headers={"host": "forensiguard-api.onrender.com"})

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
