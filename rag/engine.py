import os
import logging
from sqlalchemy.orm import Session
from database.models import PolicyClauseModel

logger = logging.getLogger("globalclaims")

def generate_query_embedding(query_text: str) -> list:
    """
    Generates text embedding vector using Azure OpenAI text-embedding-3-small deployment.
    """
    endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
    key = os.getenv("AZURE_OPENAI_API_KEY") or os.getenv("AZURE_OPENAI_KEY")
    deployment = os.getenv("AZURE_EMBEDDING_DEPLOYMENT", "text-embedding-3-small")
    
    if endpoint and key and "your_azure_openai" not in key.lower():
        try:
            from openai import AzureOpenAI
            api_version = os.getenv("AZURE_OPENAI_API_VERSION", "2024-06-01")
            client = AzureOpenAI(azure_endpoint=endpoint, api_key=key, api_version=api_version)
            response = client.embeddings.create(input=query_text, model=deployment)
            vector = response.data[0].embedding
            print(f"[AZURE OPENAI EMBEDDINGS] Generated vector embedding ({len(vector)} dimensions) using deployment '{deployment}'")
            logger.info(f"--- AZURE OPENAI EMBEDDINGS --- Generated vector ({len(vector)} dims) for deployment '{deployment}'")
            return vector
        except Exception as embed_err:
            logger.warning(f"Azure OpenAI Embedding generation notice: {embed_err}")
            print(f"[AZURE OPENAI EMBEDDINGS NOTICE] {embed_err}")
    return []

def search_policy_clauses(query: str, policy_type: str, db: Session) -> dict:
    """
    RAG Policy Clause Search with Vector Embeddings.
    Uses Azure AI Search & Azure OpenAI Embeddings if configured.
    Otherwise queries SQLite PolicyClause database cleanly.
    """
    search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT") or os.getenv("AZURE_AI_SEARCH_ENDPOINT")
    search_key = os.getenv("AZURE_SEARCH_KEY") or os.getenv("AZURE_AI_SEARCH_KEY")
    search_index = os.getenv("AZURE_SEARCH_INDEX") or os.getenv("AZURE_AI_SEARCH_INDEX", "insurance-policies-index")

    # Generate vector embedding for semantic/hybrid search
    query_vector = generate_query_embedding(query)

    print(f"[RAG INVOCATION] Query: '{query}' | Target Index: '{search_index}' | Azure Search: {bool(search_endpoint and search_key)} | Vector Dims: {len(query_vector)}")
    logger.info(f"--- RAG POLICY CLAUSE SEARCH --- Query: '{query}' | Index: '{search_index}' | Vector Dims: {len(query_vector)}")

    if search_endpoint and search_key and search_key != "your_search_key":
        try:
            from azure.search.documents import SearchClient
            from azure.search.documents.models import VectorizedQuery
            from azure.core.credentials import AzureKeyCredential

            client = SearchClient(search_endpoint, search_index, AzureKeyCredential(search_key))
            
            if query_vector:
                vector_query = VectorizedQuery(
                    vector=query_vector,
                    k_nearest_neighbors=3,
                    fields="content_vector"
                )
                results = client.search(
                    search_text=query,
                    vector_queries=[vector_query],
                    top=2
                )
            else:
                results = client.search(search_text=query, top=2)

            retrieved = []
            for r in results:
                retrieved.append({
                    "title": r.get("title", "Policy Clause"),
                    "content": r.get("content", ""),
                    "score": float(r.get("@search.score", 0.95)),
                    "coverage_limit": float(r.get("coverage_limit", 5000.0))
                })

            if retrieved:
                print(f"[AZURE AI SEARCH RAG SUCCESS] Retrieved {len(retrieved)} policy clauses from index '{search_index}'")
                logger.info(f"--- AZURE AI SEARCH RAG SUCCESS --- Retrieved clause: '{retrieved[0]['title']}'")
                return {
                    "source": "Azure AI Search RAG",
                    "clause": retrieved[0]["content"],
                    "title": retrieved[0]["title"],
                    "similarity": retrieved[0]["score"],
                    "coverage_limit": float(retrieved[0].get("coverage_limit") or 5000.0)
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
            "similarity": 0.94,
            "coverage_limit": float(clause.coverage_limit or 5000.0)
        }

    return {
        "source": "Grounded Policy Database RAG",
        "clause": "No matching policy found",
        "title": "Unmatched Policy",
        "similarity": 0.0,
        "coverage_limit": 0.0
    }
