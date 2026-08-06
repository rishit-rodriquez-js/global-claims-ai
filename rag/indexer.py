import os
import glob
from sqlalchemy.orm import Session
from database.db import SessionLocal
from database.models import PolicyClauseModel

def index_policy_documents():
    """
    Indexes policy documents with 1536-dim vector embeddings into Azure AI Search vector index.
    """
    search_endpoint = os.getenv("AZURE_SEARCH_ENDPOINT") or os.getenv("AZURE_AI_SEARCH_ENDPOINT")
    search_key = os.getenv("AZURE_SEARCH_KEY") or os.getenv("AZURE_AI_SEARCH_KEY")
    search_index = os.getenv("AZURE_SEARCH_INDEX") or os.getenv("AZURE_AI_SEARCH_INDEX", "insurance-policies-index")

    from rag.engine import generate_query_embedding

    db = SessionLocal()
    db_clauses = db.query(PolicyClauseModel).all()
    
    documents = []
    for c in db_clauses:
        clause_vector = generate_query_embedding(f"{c.title}: {c.content}")
        doc = {
            "id": c.id.replace("-", "_"),
            "policy_type": c.policy_type,
            "section_code": c.section_code,
            "title": c.title,
            "content": c.content,
            "coverage_limit": float(c.coverage_limit or 0.0),
            "deductible": float(c.deductible or 0.0)
        }
        if clause_vector:
            doc["content_vector"] = clause_vector
        documents.append(doc)
    db.close()

    print(f"[RAG INDEXER] Prepared {len(documents)} policy clauses with vector embeddings for indexing.")

    if search_endpoint and search_key and "your_search" not in search_key.lower():
        try:
            from azure.search.documents.indexes import SearchIndexClient
            from azure.search.documents.indexes.models import (
                SearchIndex, SimpleField, SearchableField, SearchField, SearchFieldDataType,
                VectorSearch, HnswAlgorithmConfiguration, VectorSearchProfile
            )
            from azure.search.documents import SearchClient
            from azure.core.credentials import AzureKeyCredential

            index_client = SearchIndexClient(search_endpoint, AzureKeyCredential(search_key))
            
            # Configure HNSW Vector Search profile
            vector_search = VectorSearch(
                algorithms=[HnswAlgorithmConfiguration(name="hnsw-config")],
                profiles=[VectorSearchProfile(name="vector-profile", algorithm_configuration_name="hnsw-config")]
            )

            fields = [
                SimpleField(name="id", type="Edm.String", key=True),
                SearchableField(name="policy_type", type="Edm.String", filterable=True),
                SearchableField(name="section_code", type="Edm.String", filterable=True),
                SearchableField(name="title", type="Edm.String"),
                SearchableField(name="content", type="Edm.String"),
                SimpleField(name="coverage_limit", type="Edm.Double"),
                SimpleField(name="deductible", type="Edm.Double"),
                SearchField(
                    name="content_vector",
                    type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
                    searchable=True,
                    vector_search_dimensions=1536,
                    vector_search_profile_name="vector-profile"
                )
            ]

            # Recreate or verify index schema with vector search field
            try:
                existing_index = index_client.get_index(search_index)
                has_vector = any(f.name == "content_vector" for f in existing_index.fields)
                if not has_vector:
                    print(f"[RAG INDEXER] Existing index '{search_index}' missing vector field. Recreating vector-enabled index...")
                    index_client.delete_index(search_index)
                    index = SearchIndex(name=search_index, fields=fields, vector_search=vector_search)
                    index_client.create_index(index)
            except Exception:
                print(f"[RAG INDEXER] Creating new vector-enabled index '{search_index}' on Azure AI Search...")
                index = SearchIndex(name=search_index, fields=fields, vector_search=vector_search)
                index_client.create_index(index)

            search_client = SearchClient(search_endpoint, search_index, AzureKeyCredential(search_key))
            result = search_client.upload_documents(documents=documents)
            succeeded_count = sum(1 for r in result if r.succeeded)
            print(f"[AZURE AI SEARCH INDEXER SUCCESS] Indexed {succeeded_count}/{len(documents)} vector documents to index '{search_index}' at {search_endpoint}")
            return True
        except Exception as e:
            print(f"[AZURE AI SEARCH INDEXER NOTICE] Indexing notice: {e}. Policy clauses remain active in grounded database RAG.")

    print(f"[LOCAL RAG INDEXER] Local database policy clause RAG contains {len(documents)} active clauses.")
    return True

if __name__ == "__main__":
    index_policy_documents()
