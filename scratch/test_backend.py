import sys
import os

# Add project root and backend to python path
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("./backend"))

# Force fresh DB recreation for test
db_file = os.path.abspath("./database/global_claims.db")
if os.path.exists(db_file):
    try:
        os.remove(db_file)
    except Exception:
        pass

from fastapi.testclient import TestClient
from database.db import init_db
from backend.main import app

def test_api():
    init_db()  # Initialize DB with fresh schema
    with TestClient(app) as client:
        print("Testing / API root...")
        r0 = client.get("/")
        assert r0.status_code == 200, f"Failed root: {r0.text}"
        print("Root response:", r0.json())

        print("Testing /api/users...")
        r_users = client.get("/api/users")
        assert r_users.status_code == 200, f"Failed users: {r_users.text}"
        print(f"Retrieved {len(r_users.json())} users.")

        print("Testing /api/claims...")
        r2 = client.get("/api/claims")
        assert r2.status_code == 200, f"Failed claims: {r2.text}"
        claims = r2.json()
        print(f"Retrieved {len(claims)} seeded claims.")

        print("Testing claim submission (users -> claims -> documents -> audit_logs)...")
        r3 = client.post(
            "/api/claims/submit",
            data={
                "user_id": "USR-101",
                "claimant_name": "Emily Carter",
                "policy_number": "POL-HTH-7721",
                "policy_type": "Health Standard",
                "claim_type": "Emergency Medical",
                "amount": "1250.00",
                "incident_date": "2026-08-04",
                "description": "Urgent care visit for laceration repair."
            }
        )
        assert r3.status_code == 200, f"Failed submit: {r3.text}"
        submit_res = r3.json()
        new_claim_id = submit_res["claim_id"]
        print("Submission verdict:", submit_res["verdict"], "| Confidence:", submit_res["confidence"], "| Claim ID:", new_claim_id)

        print("Testing DESC dashboard ordering...")
        r_claims_after = client.get("/api/claims")
        all_claims = r_claims_after.json()
        assert all_claims[0]["id"] == new_claim_id, f"Newest claim {new_claim_id} should be first, got {all_claims[0]['id']}"
        print("DESC Dashboard ordering verified: Newest claim is first!")

        print("Testing OCR parse-document endpoint...")
        r_ocr = client.post(
            "/api/claims/parse-document",
            files={"file": ("invoice_sample.pdf", b"Patient: Emily Carter Amount: $1,850.00", "application/pdf")}
        )
        assert r_ocr.status_code == 200, f"Failed parse document: {r_ocr.text}"
        ocr_res = r_ocr.json()
        assert ocr_res["status"] == "success"
        print("OCR auto-population parsed claimant:", ocr_res["extracted_data"].get("claimant_name"))

        print("Testing Officer Review (reviews table)...")
        claim_id = claims[0]["id"]
        r_rev = client.post(f"/api/claims/{claim_id}/review", json={"status": "Approved", "notes": "Approved after manual check.", "officer_id": "USR-801"})
        assert r_rev.status_code == 200, f"Failed review: {r_rev.text}"

        print("Testing /api/audit-logs...")
        r4 = client.get("/api/audit-logs")
        assert r4.status_code == 200, f"Failed audit: {r4.text}"
        print(f"Retrieved {len(r4.json())} audit log records.")

        print("\n==================================================")
        print("ALL NEW SCHEMA TABLE & PRIORITY 1 TESTS PASSED CLEANLY!")
        print("==================================================")

if __name__ == "__main__":
    test_api()
