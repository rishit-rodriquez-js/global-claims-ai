from sqlalchemy import Column, String, Float, Integer, Text, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
import datetime

Base = declarative_base()

class ClaimModel(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, index=True)
    claimant_name = Column(String, nullable=False)
    policy_number = Column(String, nullable=False)
    policy_type = Column(String, nullable=False)
    claim_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    covered_amount = Column(Float, default=0.0)
    incident_date = Column(String, nullable=False)
    submitted_date = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d"))
    status = Column(String, default="Human Review")  # Approved, Human Review, Rejected
    confidence = Column(Float, default=0.0)
    fraud_risk = Column(String, default="Low (0%)")
    fraud_score = Column(Float, default=0.0)
    document_name = Column(String, nullable=True)
    explanation = Column(Text, nullable=True)
    retrieved_clause = Column(Text, nullable=True)
    evidence_json = Column(Text, nullable=True)

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    agent = Column(String, nullable=False)
    claim_id = Column(String, nullable=False)
    action = Column(String, nullable=False)
    confidence = Column(Float, default=0.0)
    decision = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    pii_status = Column(String, default="Masked")

class PolicyClauseModel(Base):
    __tablename__ = "policy_clauses"

    id = Column(String, primary_key=True, index=True)
    policy_type = Column(String, nullable=False)
    section_code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    coverage_limit = Column(Float, nullable=True)
    deductible = Column(Float, default=0.0)
