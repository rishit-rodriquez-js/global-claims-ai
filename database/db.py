import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, ClaimModel, AuditLogModel, PolicyClauseModel

DB_PATH = os.path.join(os.path.dirname(__file__), "global_claims.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Seed sample policy clauses if empty
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

    # Seed initial sample claims if empty
    if db.query(ClaimModel).count() == 0:
        sample_claims = [
            ClaimModel(
                id="CLM-8921",
                claimant_name="Alexander Wright",
                policy_number="POL-HTH-7721",
                policy_type="Health Standard",
                claim_type="Medical Invoice",
                amount=1450.0,
                covered_amount=1450.0,
                incident_date="2026-07-28",
                submitted_date="2026-08-01",
                status="Approved",
                confidence=96.4,
                fraud_risk="Low (4.2%)",
                fraud_score=4.2,
                document_name="st_jude_hospital_bill.pdf",
                explanation="Medical invoice matches outpatient emergency policy limits under Section H-104. No exclusions apply. Total claim amount ($1,450.00) is within the $2,500 per-incident emergency coverage ceiling.",
                retrieved_clause="Section H-104: Outpatient Emergency Medical Expenses are covered up to $2,500.00 per event subject to a $100 copay.",
                evidence_json='["Itemized hospital charge verified against St. Jude Medical System rates.", "Claimant policy POL-HTH-7721 is active with zero outstanding premiums."]'
            ),
            ClaimModel(
                id="CLM-8922",
                claimant_name="Sophia Martinez",
                policy_number="POL-AUT-4402",
                policy_type="Auto Premium",
                claim_type="Collision Damage Repair",
                amount=8200.0,
                covered_amount=0.0,
                incident_date="2026-07-30",
                submitted_date="2026-08-03",
                status="Human Review",
                confidence=78.2,
                fraud_risk="Medium (24.8%)",
                fraud_score=24.8,
                document_name="auto_body_estimate_repair.pdf",
                explanation="Repair estimate includes unverified aftermarket performance modifications ($3,200) not registered under primary vehicle schedule. Escalated to Claims Officer for manual adjustment.",
                retrieved_clause="Section A-302: Vehicle repairs are covered up to actual cash value for OEM replacement parts. Custom aftermarket non-factory accessories require rider endorsement A-MOD.",
                evidence_json='["Collision estimate total $8,200.00 exceeds standard single-part auto threshold ($5,000).", "Line items 4-7 list non-OEM sport exhaust system."]'
            )
        ]
        db.add_all(sample_claims)

    db.commit()
    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
