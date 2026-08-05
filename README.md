# GlobalClaims AI — Automated & Explainable Insurance Claim Processing Platform

> **GenAI Designathon MVP** — An AI-powered insurance claim processing platform that automates routine claim approvals while keeping a Human Claims Officer in the loop for uncertain or high-risk decisions.

---

## 🌟 Primary Capabilities & Features

1. **4-Agent GenAI Architecture**:
   - **Document Agent**: Extracts structured claim JSON from uploaded invoices & medical bills using Azure AI Document Intelligence.
   - **Coverage Agent**: Retrieves exact matching policy clauses using Azure AI Search (RAG) and validates coverage limits.
   - **Fraud Agent**: Evaluates duplicate invoices, abnormal amount spikes, and suspicious part modifications to compute a Fraud Risk Score.
   - **Decision Agent**: Combines outputs into **Recommendation** (`Approved`, `Human Review`, `Rejected`), **Confidence Score** ($\ge 90\%$), and **Explainable Reason**.
2. **Explainability & Grounding**:
   - **Explainability Timeline**: Visual 6-stage audit sequence (`Upload` $\rightarrow$ `OCR` $\rightarrow$ `Policy Match` $\rightarrow$ `Fraud Check` $\rightarrow$ `Reasoning` $\rightarrow$ `Decision`).
   - **RAG Policy Citations**: Direct citations of exact policy clauses used in the verdict.
3. **Human-in-the-Loop Officer Workspace**:
   - Split-screen workspace for reviewing claims where AI confidence is $< 90\%$ or fraud risk is elevated.
   - One-click **Approve**, **Reject**, or **Request More Information** with officer notes.
4. **Interactive Microsoft Copilot Assistant**:
   - Natural language assistant for asking queries like *"Why was claim CLM-8922 escalated?"* or *"Explain policy clause H-104"*.
5. **Security & Guardrails**:
   - **PII Masking**: Redacts phone numbers, emails, SSNs, and credit card numbers before displaying logs.
   - **Prompt Injection Defense**: Sanitizes uploaded document text to prevent prompt injection attacks.
   - **Grounded Responses**: AI answers strictly using retrieved policy context without hallucination.

---

## 🎨 UI / UX Aesthetics

- **Design Inspiration**: **Linear.app** + **Stripe Dashboard** + **Microsoft Copilot**.
- **Tech Stack**: React, JavaScript (`.jsx`), Vite, Tailwind CSS, Lucide React icons.
- **Performance Targets**:
  - Dashboard load $< 2\text{s}$
  - Document upload $< 5\text{s}$
  - Policy retrieval $< 2\text{s}$
  - Claim decision $< 10\text{s}$
  - 0 console errors, 0 runtime warnings.

---

## 🚀 Quick Start & Installation

### 1. Backend Setup (FastAPI Python)
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

pip install -r requirements.txt
python main.py
```
*Backend runs on `http://localhost:8000`*

### 2. Frontend Setup (React JavaScript)
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## ⚙️ Environment Variables Configuration (`.env`)

Copy `.env.example` to `.env` in the root folder:
```env
AZURE_OPENAI_ENDPOINT=https://your-azure-openai.openai.azure.com/
AZURE_OPENAI_KEY=your_azure_openai_key
AZURE_OPENAI_DEPLOYMENT=gpt-4o

AZURE_DOCUMENT_INTELLIGENCE_ENDPOINT=https://your-doc-intel.cognitiveservices.azure.com/
AZURE_DOCUMENT_INTELLIGENCE_KEY=your_doc_intel_key

AZURE_SEARCH_ENDPOINT=https://your-search.search.windows.net
AZURE_SEARCH_KEY=your_search_key
AZURE_SEARCH_INDEX=insurance-policies-index

CONFIDENCE_THRESHOLD=0.90
```
*Note: If live Azure credentials are omitted, the application displays clean system error indicators and grounded database responses without fabricating fake AI outputs.*

---

## 📜 Repository Commit History & Milestones

1. `feat: initialize project` — Directory structure, `.env.example`, `.gitignore`.
2. `feat: build React dashboard` — Linear/Stripe style React dashboard with metrics & claim tables.
3. `feat: implement claim submission` — Wizard with drag-and-drop upload & progress bar.
4. `feat: integrate Azure Document Intelligence` — Document Extraction Agent & Form Recognizer integration.
5. `feat: implement Azure AI Search RAG` — RAG engine and sample policy indexer.
6. `feat: implement AI decision pipeline` - 4-Agent pipeline execution & audit trail logging.
7. `feat: implement human review workflow` — Claims Officer split review workspace.
8. `feat: implement AI Copilot` — Microsoft Copilot style assistant.
9. `feat: polish UI and responsiveness` — CSS animations, accessibility, < 2s performance targets.
10. `docs: finalize README and deployment guide` — Documentation & demo instructions.
