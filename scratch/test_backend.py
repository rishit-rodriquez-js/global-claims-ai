import sys
import os

# Add project root and backend to python path
sys.path.insert(0, os.path.abspath("."))
sys.path.insert(0, os.path.abspath("./backend"))

from fastapi.testclient import TestClient
from database.db import init_db
from backend.main import app

def test_api():
    init_db()  # Explicitly initialize DB for test client
    with TestClient(app) as client:
        print("Testing / API root...")
        r0 = client.get("/")
        assert r0.status_code == 200, f"Failed root: {r0.text}"
        print("Root response:", r0.json())

        print("Testing /api/health...")
        r1 = client.get("/api/health")
        assert r1.status_code == 200, f"Failed health: {r1.text}"
        print("Health response:", r1.json())

        print("Testing /api/claims...")
        r2 = client.get("/api/claims")
        assert r2.status_code == 200, f"Failed claims: {r2.text}"
        claims = r2.json()
        print(f"Retrieved {len(claims)} seeded claims.")

        print("Testing claim submission with 4-agent pipeline...")
        r3 = client.post(
            "/api/claims/submit",
            data={
                "claimant_name": "Marcus Vance Test",
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
        print("Submission verdict:", submit_res["verdict"], "| Confidence:", submit_res["confidence"])

        print("Testing /api/audit-logs...")
        r4 = client.get("/api/audit-logs")
        assert r4.status_code == 200, f"Failed audit: {r4.text}"
        print(f"Retrieved {len(r4.json())} audit log records.")

        print("\n==================================================")
        print("ALL BACKEND VERIFICATION TESTS PASSED CLEANLY!")
        print("==================================================")

if __name__ == "__main__":
    test_api()
