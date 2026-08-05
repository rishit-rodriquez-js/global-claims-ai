from rag.engine import search_policy_clauses
from sqlalchemy.orm import Session

def run_coverage_agent(claim_data: dict, db: Session) -> dict:
    """
    Agent 2: Coverage Agent.
    Retrieves policy clauses via RAG and evaluates claim eligibility against policy rules.
    """
    policy_type = claim_data.get("policy_type", "Health Standard")
    claim_type = claim_data.get("claim_type", "Emergency Medical")
    amount = float(claim_data.get("amount", 0.0))

    rag_result = search_policy_clauses(f"{policy_type} {claim_type} coverage", policy_type, db)

    # Basic eligibility reasoning based on limit checks
    is_covered = True
    reason = f"Claim for ${amount} evaluated against {rag_result['title']}."

    if "Auto" in policy_type and amount > 5000:
        is_covered = False
        reason = f"Claim amount (${amount}) triggers aftermarket / high-value repair review under {rag_result['title']}."

    return {
        "agent": "Coverage Agent",
        "is_covered": is_covered,
        "retrieved_clause": rag_result["clause"],
        "policy_title": rag_result["title"],
        "similarity": rag_result["similarity"],
        "reason": reason
    }
