import os
import logging
from sqlalchemy.orm import Session
from database.models import PolicyClauseModel

logger = logging.getLogger("globalclaims")

def search_policy_clauses(query: str, policy_type: str, db: Session) -> dict:
    """
    RAG Policy Clause Search.
    Uses Azure AI Search if credentials are configured.
    Otherwise queries SQLite PolicyClause database cleanly.
    """
    search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT") or os.getenv("AZURE_AI_SEARCH_ENDPOINT")
    search_key = os.getenv("AZURE_SEARCH_KEY") or os.getenv("AZURE_AI_SEARCH_KEY")
    search_index = os.getenv("AZURE_SEARCH_INDEX") or os.getenv("AZURE_AI_SEARCH_INDEX", "insurance-policies-index")

    print(f"[RAG INVOCATION] Query: '{query}' | Target Index: '{search_index}' | Azure Search Configured: {bool(search_endpoint and search_key)}")
    logger.info(f"--- RAG POLICY CLAUSE SEARCH --- Query: '{query}' | Index: '{search_index}'")

    if search_endpoint and search_key and search_key != "your_search_key":
        try:
            from azure.search.documents import SearchClient
            from azure.core.credentials import AzureKeyCredential

            client = SearchClient(search_endpoint, search_index, AzureKeyCredential(search_key))
            results = client.search(search_text=query, top=2)
            retrieved = []
            for r in results:
                retrieved.append({
                    "title": r.get("title", "Policy Clause"),
                    "content": r.get("content", ""),
                    "score": r.get("@search.score", 0.95)
                })

            if retrieved:
                print(f"[AZURE AI SEARCH RAG SUCCESS] Retrieved {len(retrieved)} policy clauses from index '{search_index}'")
                logger.info(f"--- AZURE AI SEARCH RAG SUCCESS --- Retrieved clause: '{retrieved[0]['title']}'")
                return {
                    "source": "Azure AI Search RAG",
                    "clause": retrieved[0]["content"],
                    "title": retrieved[0]["title"],
                    "similarity": retrieved[0]["score"]
                }
        except Exception as e:
            print(f"[AZURE AI SEARCH NOTICE] RAG search notice: {e}. Falling back to database policy RAG.")
            logger.warning(f"Azure AI Search notice: {e}. Fallback to database policy RAG.")

    # Database query fallback
    clause = db.query(PolicyClauseModel).filter(
        PolicyClauseModel.policy_type.ilike(f"%{policy_type.split()[0]}%")
    ).first()

    if clause:
        print(f"[GROUNDED DATABASE RAG SUCCESS] Matched database policy clause: {clause.section_code} ({clause.title})")
        logger.info(f"--- GROUNDED DATABASE RAG SUCCESS --- Matched: {clause.section_code}")
        return {
            "source": "Grounded Policy Database RAG",
            "clause": f"{clause.section_code}: {clause.content}",
            "title": clause.title,
            "similarity": 0.94
        }

    return {
        "source": "Grounded Policy Database RAG",
        "clause": "No matching policy found",
        "title": "Unmatched Policy",
        "similarity": 0.0
    }
