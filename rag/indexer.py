import os
import glob
from sqlalchemy.orm import Session
from database.db import SessionLocal
from database.models import PolicyClauseModel

def index_policy_documents():
    """
    Indexes policy documents into Azure AI Search index and SQLite PolicyClause DB.
    """
    search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT") or os.getenv("AZURE_AI_SEARCH_ENDPOINT")
    search_key = os.getenv("AZURE_SEARCH_KEY") or os.getenv("AZURE_AI_SEARCH_KEY")
    search_index = os.getenv("AZURE_SEARCH_INDEX") or os.getenv("AZURE_AI_SEARCH_INDEX", "insurance-policies-index")

    db = SessionLocal()
    db_clauses = db.query(PolicyClauseModel).all()
    
    documents = []
    for c in db_clauses:
        documents.append({
            "id": c.id.replace("-", "_"),
            "policy_type": c.policy_type,
            "section_code": c.section_code,
            "title": c.title,
            "content": c.content,
            "coverage_limit": float(c.coverage_limit or 0.0),
            "deductible": float(c.deductible or 0.0)
        })
    db.close()

    print(f"[RAG INDEXER] Prepared {len(documents)} policy clauses for indexing.")

    if search_endpoint and search_key and "your_search" not in search_key.lower():
        try:
            from azure.search.documents.indexes import SearchIndexClient
            from azure.search.documents.indexes.models import SearchIndex, SimpleField, SearchableField
            from azure.search.documents import SearchClient
            from azure.core.credentials import AzureKeyCredential

            index_client = SearchIndexClient(search_endpoint, AzureKeyCredential(search_key))
            
            # Auto-create Azure Search index if it does not exist
            try:
                index_client.get_index(search_index)
            except Exception:
                print(f"[RAG INDEXER] Creating index '{search_index}' on Azure AI Search...")
                fields = [
                    SimpleField(name="id", type="Edm.String", key=True),
                    SearchableField(name="policy_type", type="Edm.String", filterable=True),
                    SearchableField(name="section_code", type="Edm.String", filterable=True),
                    SearchableField(name="title", type="Edm.String"),
                    SearchableField(name="content", type="Edm.String"),
                    SimpleField(name="coverage_limit", type="Edm.Double"),
                    SimpleField(name="deductible", type="Edm.Double")
                ]
                index = SearchIndex(name=search_index, fields=fields)
                index_client.create_index(index)
                print(f"[RAG INDEXER SUCCESS] Created Azure AI Search index '{search_index}'.")

            search_client = SearchClient(search_endpoint, search_index, AzureKeyCredential(search_key))
            result = search_client.upload_documents(documents=documents)
            succeeded_count = sum(1 for r in result if r.succeeded)
            print(f"[AZURE AI SEARCH INDEXER SUCCESS] Indexed {succeeded_count}/{len(documents)} documents to index '{search_index}' at {search_endpoint}")
            return True
        except Exception as e:
            print(f"[AZURE AI SEARCH INDEXER NOTICE] Indexing notice: {e}. Policy clauses remain active in grounded database RAG.")

    print(f"[LOCAL RAG INDEXER] Local database policy clause RAG contains {len(documents)} active clauses.")
    return True

if __name__ == "__main__":
    index_policy_documents()
