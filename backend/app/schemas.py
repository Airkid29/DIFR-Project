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

class OAuthAuthorizeResponse(BaseModel):
    authorization_url: str
    state: str

class OAuthCallbackRequest(BaseModel):
    provider: str
    code: str
    redirect_uri: str
    state: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    mfa_code: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    avatar_url: Optional[str] = None
    slack_webhook_incidents: Optional[str] = None
    slack_webhook_evidence: Optional[str] = None
    slack_webhook_audit: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    account_type: str = "professional"  # professional | enterprise
    organization_name: Optional[str] = None

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    organization_name: Optional[str] = None
    onboarding_completed: Optional[bool] = None
    slack_webhook_url: Optional[str] = None
    avatar_url: Optional[str] = None
    slack_webhook_incidents: Optional[str] = None
    slack_webhook_evidence: Optional[str] = None
    slack_webhook_audit: Optional[str] = None

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str

class UserResponse(UserBase):
    id: int
    account_type: str = "professional"
    organization_name: Optional[str] = None
    mfa_enabled: bool
    onboarding_completed: bool = False
    is_active: bool
    last_login: Optional[datetime]
    slack_webhook_url: Optional[str] = None
    avatar_url: Optional[str] = None
    slack_webhook_incidents: Optional[str] = None
    slack_webhook_evidence: Optional[str] = None
    slack_webhook_audit: Optional[str] = None

    class Config:
        from_attributes = True


# Ultra Admin Schemas
class UltraAdminStatsResponse(BaseModel):
    total_users: int
    total_incidents: int
    total_evidence: int
    total_visitors: int
    active_users_today: int
    incidents_by_severity: Dict[str, int]
    users_by_role: Dict[str, int]

    class Config:
        from_attributes = True

class ActivityHistoryResponse(BaseModel):
    id: int
    user_id: int
    action_type: str
    title: str
    description: Optional[str]
    resource_id: Optional[str]
    extra_data: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

class ThreatIntelLookup(BaseModel):
    indicator: str
    indicator_type: str  # hash, url, domain, ip

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
    organization_name: Optional[str] = None
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
    incident_id: Optional[str] = None
    attachment_name: Optional[str] = None

class CustodyHistoryResponse(BaseModel):
    id: int
    evidence_id: str
    date: datetime
    transfer_from: str
    transfer_to: str
    action_taken: str

    class Config:
        from_attributes = True

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
    owner_id: Optional[int] = None
    organization_name: Optional[str] = None
    incident_id: Optional[str] = None
    status: str = "verified"
    pending_custodian_id: Optional[int] = None
    attachment_path: Optional[str] = None
    custody_chain: List[CustodyHistoryResponse] = []

    class Config:
        from_attributes = True

class CustodyTransfer(BaseModel):
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
    organization_name: Optional[str] = None

    class Config:
        from_attributes = True


class IntegrationSettingsResponse(BaseModel):
    virustotal_configured: bool
    otx_configured: bool
    slack_configured: bool
    slack_webhook_incidents_configured: bool
    slack_webhook_evidence_configured: bool
    slack_webhook_audit_configured: bool


class IntegrationSettingsUpdate(BaseModel):
    virustotal_api_key: Optional[str] = None
    otx_api_key: Optional[str] = None
    slack_webhook_url: Optional[str] = None
    slack_webhook_incidents: Optional[str] = None
    slack_webhook_evidence: Optional[str] = None
    slack_webhook_audit: Optional[str] = None



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
    organization_name: Optional[str] = None
    created_at: datetime
    finished_at: Optional[datetime]

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: int
    user_id: int
    type: str
    title: str
    description: str
    created_at: datetime
    read: bool
    link: Optional[str] = None

    class Config:
        from_attributes = True


class DashboardStatsResponse(BaseModel):
    active_incidents: int
    evidence_triaged: int
    integrity_verified: str
    avg_triage: str
    incident_volume: List[Dict[str, Any]]
    recent_threats: List[Dict[str, Any]]

    class Config:
        from_attributes = True

