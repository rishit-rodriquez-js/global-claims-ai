import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, UserModel, ClaimModel, DocumentModel, AuditLogModel, ReviewModel, PolicyClauseModel

DB_PATH = os.path.join(os.path.dirname(__file__), "global_claims.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    # If existing DB is using old schema without user_id, recreate tables cleanly
    try:
        db = SessionLocal()
        db.query(ClaimModel).first()
        db.close()
    except Exception:
        db.close()
        Base.metadata.drop_all(bind=engine)

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Users
    if db.query(UserModel).count() == 0:
        users = [
            UserModel(
                id="USR-101",
                name="Alexander Wright",
                email="alexander.wright@example.com",
                password_hash="pbkdf2:sha256:hashed_pass_customer_1",
                role="Customer"
            ),
            UserModel(
                id="USR-102",
                name="Sophia Martinez",
                email="sophia.martinez@example.com",
                password_hash="pbkdf2:sha256:hashed_pass_customer_2",
                role="Customer"
            ),
            UserModel(
                id="USR-801",
                name="Senior Officer Sarah Vance",
                email="sarah.vance@globalclaims.ai",
                password_hash="pbkdf2:sha256:hashed_pass_officer_1",
                role="Claim Officer"
            )
        ]
        db.add_all(users)
        db.commit()

    # 2. Seed Policy Clauses
    if db.query(PolicyClauseModel).count() == 0:
        clauses = [
            PolicyClauseModel(
                id="POL-H-104",
                policy_type="Health Standard",
                section_code="Section H-104",
                title="Outpatient Emergency Medical Expenses",
                content="Outpatient Emergency Medical Expenses are covered up to $2,500.00 per event subject to a $100 copay. Pre-authorization is waived for acute emergency visits.",
                coverage_limit=2500.0,
                deductible=100.0
            ),
            PolicyClauseModel(
                id="POL-A-302",
                policy_type="Auto Premium",
                section_code="Section A-302",
                title="Collision Repair & Custom Accessories",
                content="Vehicle repairs are covered up to actual cash value for OEM replacement parts. Custom aftermarket non-factory accessories require rider endorsement A-MOD.",
                coverage_limit=15000.0,
                deductible=500.0
            ),
            PolicyClauseModel(
                id="POL-P-201",
                policy_type="Property Gold",
                section_code="Section P-201",
                title="Plumbing Burst & Water Damage Infiltration",
                content="Direct physical loss from accidental discharge or overflow of water or steam from plumbing systems is fully covered up to $50,000.",
                coverage_limit=50000.0,
                deductible=1000.0
            )
        ]
        db.add_all(clauses)
        db.commit()

    # 3. Seed Claims
    if db.query(ClaimModel).count() == 0:
        c1 = ClaimModel(
            id="CLM-8921",
            user_id="USR-101",
            claimant_name="Alexander Wright",
            policy_number="POL-HTH-7721",
            policy_type="Health Standard",
            claim_type="Medical Invoice",
            amount=1450.0,
            covered_amount=1450.0,
            status="Approved",
            confidence=96.4,
            fraud_risk="Low (4.2%)",
            fraud_score=4.2,
            explanation="Medical invoice matches outpatient emergency policy limits under Section H-104. No exclusions apply.",
            retrieved_clause="Section H-104: Outpatient Emergency Medical Expenses covered up to $2,500.00 per event.",
            evidence_json='["Itemized hospital charge verified.", "Claimant policy active."]'
        )
        c2 = ClaimModel(
            id="CLM-8922",
            user_id="USR-102",
            claimant_name="Sophia Martinez",
            policy_number="POL-AUT-4402",
            policy_type="Auto Premium",
            claim_type="Collision Damage Repair",
            amount=8200.0,
            covered_amount=0.0,
            status="Human Review",
            confidence=78.2,
            fraud_risk="Medium (24.8%)",
            fraud_score=24.8,
            explanation="Repair estimate includes unverified aftermarket performance modifications ($3,200) not registered under schedule.",
            retrieved_clause="Section A-302: Vehicle repairs covered for OEM parts. Custom aftermarket accessories require endorsement A-MOD.",
            evidence_json='["Collision estimate total $8,200 exceeds threshold.", "Line items list non-OEM sport exhaust."]'
        )
        db.add_all([c1, c2])
        db.commit()

        # 4. Seed Documents
        d1 = DocumentModel(
            id="DOC-1001",
            claim_id="CLM-8921",
            blob_url="https://globalclaimsstorage.blob.core.windows.net/claims-documents/st_jude_hospital_bill.pdf",
            document_type="Medical Bill PDF"
        )
        d2 = DocumentModel(
            id="DOC-1002",
            claim_id="CLM-8922",
            blob_url="https://globalclaimsstorage.blob.core.windows.net/claims-documents/auto_body_estimate_repair.pdf",
            document_type="Auto Repair Invoice PDF"
        )
        db.add_all([d1, d2])

        # 5. Seed Audit Logs
        a1 = AuditLogModel(
            id="LOG-1001",
            claim_id="CLM-8921",
            agent_name="Decision Agent",
            action="AUTO_APPROVE",
            confidence=96.4,
            decision="Claim Approved automatically based on verified Section H-104 clause match.",
            evidence="Emergency treatment itemized receipt verified, $1,450 <= $2,500 policy ceiling.",
            pii_status="Masked (Claimant: A. W****)"
        )
        db.add(a1)

        # 6. Seed Reviews
        r1 = ReviewModel(
            id="REV-1001",
            claim_id="CLM-8922",
            officer_id="USR-801",
            decision="Pending Review",
            remarks="Escalated to Senior Officer Sarah Vance due to aftermarket exhaust parts line items.",
        )
        db.add(r1)
        db.commit()

    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
