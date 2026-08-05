import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="GlobalClaims AI API",
    description="Automated & Explainable Insurance Claim Processing Platform API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "GlobalClaims AI API",
        "version": "1.0.0",
        "azure_configured": bool(os.getenv("AZURE_OPENAI_KEY") and os.getenv("AZURE_OPENAI_KEY") != "your_azure_openai_key")
    }

@app.get("/api/health")
def health_check():
    return {"status": "ok", "message": "Backend service is operational"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
