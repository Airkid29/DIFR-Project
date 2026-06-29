from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime

# Token/Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    mfa_code: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    mfa_enabled: bool
    is_active: bool

    class Config:
        from_attributes = True

# Incident Schemas
class IncidentCreate(BaseModel):
    title: str
    severity: str
    description: Optional[str] = None

class IncidentUpdate(BaseModel):
    status: Optional[str] = None
    severity: Optional[str] = None
    owner_id: Optional[int] = None
    description: Optional[str] = None

class IncidentResponse(BaseModel):
    id: str
    title: str
    severity: str
    status: str
    owner_id: Optional[int]
    description: Optional[str]
    created_at: datetime
    closed_at: Optional[datetime]

    class Config:
        from_attributes = True

# Evidence & Custody Schemas
class EvidenceCreate(BaseModel):
    name: str
    category: str
    sha256_hash: str
    location: str

class EvidenceResponse(BaseModel):
    id: str
    name: str
    category: str
    collector: str
    date_collected: datetime
    sha256_hash: str
    sha1_hash: Optional[str]
    md5_hash: Optional[str]
    custodian: str
    location: str
    verified: bool
    custody_chain: List[CustodyHistoryResponse] = []

    class Config:
        from_attributes = True

class CustodyTransfer(BaseModel):
    transfer_to: str
    action_taken: str

class CustodyHistoryResponse(BaseModel):
    id: int
    evidence_id: str
    date: datetime
    transfer_from: str
    transfer_to: str
    action_taken: str

    class Config:
        from_attributes = True

# Timeline Event Schemas
class TimelineEventCreate(BaseModel):
    incident_id: str
    category: str
    title: str
    details: Optional[str] = None
    source: Optional[str] = None
    importance: str

class TimelineEventResponse(BaseModel):
    id: int
    incident_id: str
    timestamp: datetime
    category: str
    title: str
    details: Optional[str]
    source: Optional[str]
    importance: str

    class Config:
        from_attributes = True

# Audit Log Schema
class AuditLogResponse(BaseModel):
    id: int
    timestamp: datetime
    user_email: str
    action: str
    resource: Optional[str]
    ip_address: Optional[str]
    status: str

    class Config:
        from_attributes = True


class IntegrationSettingsResponse(BaseModel):
    virustotal_configured: bool
    otx_configured: bool


class IntegrationSettingsUpdate(BaseModel):
    virustotal_api_key: Optional[str] = None
    otx_api_key: Optional[str] = None


class ThreatIntelHashLookup(BaseModel):
    sha256_hash: str


class ThreatIntelResponse(BaseModel):
    virustotal: Optional[Dict[str, Any]] = None
    otx: Optional[Dict[str, Any]] = None
    messages: List[str] = []

    class Config:
        from_attributes = True


# YARA Job Schemas
class YaraJobResponse(BaseModel):
    id: str
    filepath: str
    status: str
    score: int
    matched_rules: List[Dict[str, Any]]
    md5: Optional[str]
    sha1: Optional[str]
    sha256: Optional[str]
    created_at: datetime
    finished_at: Optional[datetime]

    class Config:
        from_attributes = True
