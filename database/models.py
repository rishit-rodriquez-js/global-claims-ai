import datetime
from sqlalchemy import Column, String, Float, Text, ForeignKey, Integer, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class UserModel(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, nullable=False, default="Customer")  # Customer, Claim Officer, or Admin
    last_login = Column(String, nullable=True)
    failed_login_attempts = Column(Integer, default=0)
    account_locked = Column(Boolean, default=False)
    profile_image_url = Column(String, nullable=True)
    created_at = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
    updated_at = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    claims = relationship("ClaimModel", back_populates="user")
    reviews = relationship("ReviewModel", back_populates="officer")


class ClaimModel(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    claimant_name = Column(String, nullable=False, default="Claimant")
    hospital_name = Column(String, nullable=False, default="Metro Health Medical Center")
    diagnosis = Column(String, nullable=False, default="Acute Care Consultation")
    invoice_number = Column(String, nullable=False, default="INV-9001")
    policy_number = Column(String, nullable=False, default="POL-HTH-7721")
    policy_type = Column(String, nullable=False, default="Health Standard")
    claim_type = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    covered_amount = Column(Float, default=0.0)
    status = Column(String, default="Human Review")  # Approved, Human Review, Rejected
    confidence = Column(Float, default=0.0)
    fraud_risk = Column(String, default="Low (0%)")
    fraud_score = Column(Float, default=0.0)
    explanation = Column(Text, nullable=True)
    retrieved_clause = Column(Text, nullable=True)
    evidence_json = Column(Text, nullable=True)
    ocr_text = Column(Text, nullable=True)
    original_filename = Column(String, nullable=True)
    stored_blob_name = Column(String, nullable=True)
    blob_url = Column(String, nullable=True)
    created_at = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    user = relationship("UserModel", back_populates="claims")
    documents = relationship("DocumentModel", back_populates="claim")
    audit_logs = relationship("AuditLogModel", back_populates="claim")
    reviews = relationship("ReviewModel", back_populates="claim")

class DocumentModel(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False)
    original_filename = Column(String, nullable=False, default="document.pdf")
    stored_blob_name = Column(String, nullable=False, default="document.pdf")
    blob_url = Column(String, nullable=False)
    document_type = Column(String, nullable=False, default="Claim Document")
    content_type = Column(String, default="application/pdf")
    file_size = Column(Integer, default=0)
    created_at = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    claim = relationship("ClaimModel", back_populates="documents")

class AuditLogModel(Base):
    __tablename__ = "audit_logs"

    id = Column(String, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=True)
    agent_name = Column(String, nullable=False)
    action = Column(String, nullable=False)
    confidence = Column(Float, default=0.0)
    decision = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    pii_status = Column(String, default="Masked")
    timestamp = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    claim = relationship("ClaimModel", back_populates="audit_logs")

class ReviewModel(Base):
    __tablename__ = "reviews"

    id = Column(String, primary_key=True, index=True)
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False)
    officer_id = Column(String, ForeignKey("users.id"), nullable=True)
    decision = Column(String, nullable=False)  # Approved, Rejected, Request Info
    remarks = Column(Text, nullable=True)
    timestamp = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

    claim = relationship("ClaimModel", back_populates="reviews")
    officer = relationship("UserModel", back_populates="reviews")

class PolicyClauseModel(Base):
    __tablename__ = "policy_clauses"

    id = Column(String, primary_key=True, index=True)
    policy_type = Column(String, nullable=False)
    section_code = Column(String, nullable=False)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    coverage_limit = Column(Float, nullable=True)
    deductible = Column(Float, default=0.0)
