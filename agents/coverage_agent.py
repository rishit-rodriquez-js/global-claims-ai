from rag.engine import search_policy_clauses
from sqlalchemy.orm import Session

def run_coverage_agent(claim_data: dict, db: Session) -> dict:
    """
    Agent 2: Coverage Agent.
    Retrieves policy clauses via RAG (Azure AI Search or Grounded Policy DB) and evaluates claim eligibility against policy rules.
    """
    policy_type = claim_data.get("policy_type", "Health Standard")
    claim_type = claim_data.get("claim_type", "Emergency Medical")
    diagnosis = claim_data.get("diagnosis", "Emergency Care")
    amount = float(claim_data.get("amount", 0.0))

    query_str = f"{policy_type} {claim_type} {diagnosis} coverage"
    rag_result = search_policy_clauses(query_str, policy_type, db)

    is_covered = True
    coverage_limit = float(rag_result.get("coverage_limit", 5000.0))
    
    if coverage_limit > 0 and amount > coverage_limit:
        is_covered = False
        reason = f"Claim amount (${amount:,.2f}) exceeds policy clause limit (${coverage_limit:,.2f}) under {rag_result['title']}."
    else:
        reason = f"Claim for ${amount:,.2f} evaluated against {rag_result['title']} for {diagnosis}. Fully within policy threshold."

    return {
        "agent": "Coverage Agent",
        "is_covered": is_covered,
        "retrieved_clause": rag_result["clause"],
        "policy_title": rag_result["title"],
        "similarity": rag_result["similarity"],
        "reason": reason
    }
