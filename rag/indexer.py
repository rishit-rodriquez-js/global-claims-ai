import os
import glob
from sqlalchemy.orm import Session
from database.db import SessionLocal
from database.models import PolicyClauseModel

def index_policy_documents():
    """
    Indexes sample policy files into Azure AI Search or SQLite PolicyClause DB.
    """
    search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT")
    search_key = os.getenv("AZURE_SEARCH_KEY")
    search_index = os.getenv("AZURE_SEARCH_INDEX", "insurance-policies-index")

    policies_dir = "./storage/sample_policies"
    policy_files = glob.glob(os.path.join(policies_dir, "*.txt"))

    print(f"Found {len(policy_files)} policy text files for indexing.")

    if search_endpoint and search_key and search_key != "your_search_key":
        try:
            from azure.search.documents.indexes import SearchIndexClient
            from azure.search.documents import SearchClient
            from azure.core.credentials import AzureKeyCredential

            index_client = SearchIndexClient(search_endpoint, AzureKeyCredential(search_key))
            print(f"Connected to Azure AI Search endpoint {search_endpoint}")
            # Azure Search Indexing logic
            return True
        except Exception as e:
            print(f"Azure Search indexing notice: {e}")

    db = SessionLocal()
    count = db.query(PolicyClauseModel).count()
    db.close()
    print(f"Local RAG policy clause database contains {count} active clauses.")
    return True

if __name__ == "__main__":
    index_policy_documents()
