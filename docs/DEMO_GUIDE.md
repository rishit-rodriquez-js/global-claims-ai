# GlobalClaims AI — GenAI Designathon Demo Guide

Follow this 3-minute walkthrough to demonstrate GlobalClaims AI to hackathon or designathon judges.

---

## 🎬 3-Minute Demo Script

### 1. Executive Dashboard (0:00 - 0:45)
- Open the main **Overview Dashboard** (`http://localhost:3000`).
- Point out the **Linear + Stripe aesthetic**:
  - Auto-Approval Rate gauge (66.7%).
  - Real-time SLA decision counter (Avg 4.8s).
  - Search bar filtering by ID (`CLM-8921`) or claimant name.

### 2. Auto-Approved Claim Walkthrough (0:45 - 1:30)
- Click on claim **CLM-8921** ($1,450.00 Emergency Medical).
- Show the **AI Explainability View**:
  - **Confidence Gauge**: 96.4% (Exceeds $\ge 90\%$ auto-approval threshold).
  - **Explainability Timeline**: 6-stage interactive bar (`Upload` $\rightarrow$ `OCR` $\rightarrow$ `Policy Match` $\rightarrow$ `Fraud Check` $\rightarrow$ `Reasoning` $\rightarrow$ `Decision`).
  - **RAG Policy Citation**: Section H-104 ($2,500 emergency limit).

### 3. Human Review Escalation (1:30 - 2:15)
- Click on claim **CLM-8922** ($8,200.00 Auto Repair).
- Explain why it was escalated:
  - Confidence is 78.2% ($< 90\%$).
  - Fraud score triggered on **$3,200 in unregistered aftermarket parts**.
- Click **"Review in Officer Workspace"**:
  - Demonstrate split layout (Left: File & OCR preview, Right: Risk analysis).
  - Add officer notes and click **"Approve Claim"** or **"Reject Claim"**.

### 4. AI Copilot & Audit Trail (2:15 - 3:00)
- Navigate to **AI Copilot** tab:
  - Click suggested question: *"Why was claim CLM-8922 escalated?"*.
  - Show grounded citation badge (`Section A-302`).
- Navigate to **Audit Trail** tab:
  - Show immutable event logs and **PII Masking** indicator (`Claimant: S. M****`).
