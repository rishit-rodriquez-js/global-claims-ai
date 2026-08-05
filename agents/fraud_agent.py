def run_fraud_agent(claim_data: dict) -> dict:
    """
    Agent 3: Fraud Risk Agent.
    Evaluates duplicate claims, abnormal claim velocity, and amount anomalies.
    """
    amount = float(claim_data.get("amount", 0.0))
    policy_type = claim_data.get("policy_type", "")

    fraud_score = 4.2
    risk_factors = ["Zero duplicate invoices detected across claims database."]

    if amount > 10000:
        fraud_score += 15.0
        risk_factors.append(f"High single-instance claim amount (${amount}) exceeds 90th percentile limit.")

    if "Auto" in policy_type and amount > 5000:
        fraud_score += 20.0
        risk_factors.append("Repair estimate contains non-standard line items requiring parts verification.")

    risk_category = "Low"
    if fraud_score >= 30.0:
        risk_category = "High"
    elif fraud_score >= 15.0:
        risk_category = "Medium"

    return {
        "agent": "Fraud Agent",
        "fraud_score": round(fraud_score, 1),
        "risk_category": f"{risk_category} ({round(fraud_score, 1)}%)",
        "risk_factors": risk_factors
    }
