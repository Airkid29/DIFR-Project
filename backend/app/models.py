import datetime
from sqlalchemy import Column, String, Integer, DateTime, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=True)
    oauth_provider = Column(String(50), nullable=True)
    oauth_subject = Column(String(255), nullable=True)
    role = Column(String(50), default="Viewer")  # UltraAdmin, Admin, Analyst, Responder, Viewer
    account_type = Column(String(50), default="professional")  # professional, enterprise
    organization_name = Column(String(255), nullable=True)
    mfa_secret = Column(String(100), nullable=True)
    mfa_enabled = Column(Boolean, default=False)
    onboarding_completed = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    avatar_url = Column(String(512), nullable=True)
    slack_webhook_url = Column(String(512), nullable=True)
    slack_webhook_incidents = Column(String(512), nullable=True)
    slack_webhook_evidence = Column(String(512), nullable=True)
    slack_webhook_audit = Column(String(512), nullable=True)

    incidents = relationship("Incident", back_populates="owner")
    activity_history = relationship("ActivityHistory", back_populates="user", cascade="all, delete-orphan")
    integration_settings = relationship("IntegrationSetting", back_populates="user", cascade="all, delete-orphan")


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String(50), primary_key=True, index=True)  # ex: INC-2026-001
    title = Column(String(255), nullable=False)
    severity = Column(String(50), default="medium")  # critical, high, medium, low
    status = Column(String(50), default="open")  # open, triage, resolved
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    organization_name = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    closed_at = Column(DateTime, nullable=True)

    owner = relationship("User", back_populates="incidents")
    timeline_events = relationship("TimelineEvent", back_populates="incident", cascade="all, delete-orphan")


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(50), primary_key=True, index=True)  # ex: EVID-9021
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)  # Disk Image, RAM Dump, etc.
    collector = Column(String(100), nullable=False)
    date_collected = Column(DateTime, default=datetime.datetime.utcnow)
    sha256_hash = Column(String(64), nullable=False, index=True)
    sha1_hash = Column(String(40), nullable=True)
    md5_hash = Column(String(32), nullable=True)
    custodian = Column(String(100), nullable=False)
    location = Column(String(255), nullable=False)
    verified = Column(Boolean, default=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    organization_name = Column(String(255), nullable=True)
    incident_id = Column(String(50), ForeignKey("incidents.id"), nullable=True)
    status = Column(String(50), default="verified")  # verified, transfer_pending
    pending_custodian_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    attachment_path = Column(String(512), nullable=True)

    custody_chain = relationship("CustodyHistory", back_populates="evidence", cascade="all, delete-orphan")
    owner = relationship("User", foreign_keys=[owner_id])
    incident = relationship("Incident")
    pending_custodian = relationship("User", foreign_keys=[pending_custodian_id])


class CustodyHistory(Base):
    __tablename__ = "custody_history"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String(50), ForeignKey("evidence.id"), nullable=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)
    transfer_from = Column(String(100), nullable=False)
    transfer_to = Column(String(100), nullable=False)
    action_taken = Column(Text, nullable=False)

    evidence = relationship("Evidence", back_populates="custody_chain")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    incident_id = Column(String(50), ForeignKey("incidents.id"), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    category = Column(String(50), nullable=False)  # network, process, auth, malware, system
    title = Column(String(255), nullable=False)
    details = Column(Text, nullable=True)
    source = Column(String(100), nullable=True)
    importance = Column(String(50), default="medium")  # high, medium, low

    incident = relationship("Incident", back_populates="timeline_events")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    user_email = Column(String(100), nullable=False)
    action = Column(String(100), nullable=False)  # ex: EVIDENCE_REGISTER, MFA_ENABLE
    resource = Column(String(255), nullable=True)
    ip_address = Column(String(50), nullable=True)
    status = Column(String(50), default="success")  # success, failure
    organization_name = Column(String(255), nullable=True)


class ActivityHistory(Base):
    __tablename__ = "activity_history"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    action_type = Column(String(50), nullable=False)  # scan, report, intel, incident, evidence, timeline
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    resource_id = Column(String(255), nullable=True)
    extra_data = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="activity_history")


class YaraJob(Base):
    __tablename__ = "yara_jobs"

    id = Column(String(100), primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    organization_name = Column(String(255), nullable=True)
    filepath = Column(String(255), nullable=False)
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    score = Column(Integer, default=0)
    matched_rules = Column(JSON, default=list)  # List of matching rules details
    md5 = Column(String(32), nullable=True)
    sha1 = Column(String(40), nullable=True)
    sha256 = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    finished_at = Column(DateTime, nullable=True)


class IntegrationSetting(Base):
    __tablename__ = "integration_settings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # null means global
    name = Column(String(50), nullable=False)
    api_key = Column(String(512), nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = relationship("User", back_populates="integration_settings")


class VisitorLog(Base):
    __tablename__ = "visitor_logs"

    id = Column(Integer, primary_key=True, index=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), default="info")  # critical, warning, success, info
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    read = Column(Boolean, default=False)
    link = Column(String(255), nullable=True)

    user = relationship("User")

