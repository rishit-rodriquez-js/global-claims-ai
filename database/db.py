import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database.models import Base, UserModel, ClaimModel, DocumentModel, AuditLogModel, ReviewModel, PolicyClauseModel

DB_PATH = os.path.join(os.path.dirname(__file__), "global_claims.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

import bcrypt

def hash_password(password: str) -> str:
    pw_bytes = password.encode('utf-8')
    if len(pw_bytes) > 72:
        pw_bytes = pw_bytes[:72]
    return bcrypt.hashpw(pw_bytes, bcrypt.gensalt()).decode('utf-8')

def init_db():
    # If existing DB is using old schema without new columns, migrate or recreate tables cleanly
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            res = conn.execute(text("PRAGMA table_info(documents);")).fetchall()
            cols = [r[1] for r in res] if res else []
            if cols and "container_name" not in cols:
                conn.execute(text("ALTER TABLE documents ADD COLUMN container_name VARCHAR DEFAULT 'claims-documents';"))
                conn.execute(text("ALTER TABLE documents ADD COLUMN sha256_hash VARCHAR;"))
                conn.execute(text("ALTER TABLE documents ADD COLUMN azure_etag VARCHAR;"))
                conn.execute(text("ALTER TABLE documents ADD COLUMN upload_time VARCHAR;"))
                conn.execute(text("ALTER TABLE documents ADD COLUMN uploaded_by VARCHAR;"))
                conn.execute(text("ALTER TABLE documents ADD COLUMN status VARCHAR DEFAULT 'UPLOADED';"))
                conn.commit()
    except Exception as e:
        print(f"[DB MIGRATION NOTICE] SQLite schema update: {e}. Recreating tables cleanly.")
        try:
            Base.metadata.drop_all(bind=engine)
        except Exception as drop_err:
            print(f"[DB RESET NOTICE] Table drop notice: {drop_err}")

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # 1. Seed Users with bcrypt salted hashes
    if db.query(UserModel).count() == 0:
        default_hash = hash_password("GlobalClaims@2026")
        users = [
            UserModel(
                id="USR-101",
                name="Emily Carter",
                email="emily.carter@example.com",
                password_hash=default_hash,
                role="Customer"
            ),
            UserModel(
                id="USR-102",
                name="Sarah Miller",
                email="sarah.miller@example.com",
                password_hash=default_hash,
                role="Customer"
            ),
            UserModel(
                id="USR-801",
                name="Senior Officer Sarah Vance",
                email="sarah.vance@globalclaims.ai",
                password_hash=default_hash,
                role="Claim Officer"
            ),
            UserModel(
                id="USR-901",
                name="System Administrator Alex Rivera",
                email="admin@globalclaims.ai",
                password_hash=default_hash,
                role="Admin"
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

    db.close()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
