import os
import re
from fastapi import HTTPException, UploadFile

ALLOWED_EXTENSIONS = {".pdf"}
MAX_FILE_SIZE_MB = 10.0

PROMPT_INJECTION_KEYWORDS = [
    "ignore previous instructions",
    "system prompt",
    "you are now",
    "override confidence",
    "approve this claim automatically",
    "disregard policy",
    "grant coverage",
    "jailbreak",
    "developer mode"
]

def sanitize_filename(filename: str) -> str:
    """
    Sanitizes filenames to prevent path traversal vulnerabilities.
    """
    if not filename:
        return "document.pdf"
    # Remove path components
    clean_name = os.path.basename(filename)
    # Remove dangerous characters
    clean_name = re.sub(r'[^a-zA-Z0-9_.-]', '_', clean_name)
    if not clean_name.lower().endswith('.pdf'):
        clean_name += '.pdf'
    return clean_name

def validate_uploaded_file(file: UploadFile):
    """
    Validates uploaded document extension (PDF only) and integrity.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": f"Unsupported file format '{ext}'. Only PDF documents are accepted.", "details": "Allowed file extension: .pdf"}
        )

def validate_file_size(file_bytes: bytes, max_mb: float = MAX_FILE_SIZE_MB):
    """
    Validates file upload size does not exceed the maximum allowed limit.
    """
    size_mb = len(file_bytes) / (1024 * 1024)
    if size_mb > max_mb:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": f"File size ({size_mb:.2f} MB) exceeds maximum allowed limit of {max_mb} MB.", "details": "Max upload size limit: 10 MB"}
        )

def validate_claim_submission(amount: float, policy_number: str, claimant_name: str = None):
    """
    Validates claim payload parameters.
    """
    if amount is None or amount <= 0:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": "Invalid claim amount.", "details": "Claim amount must be a positive number greater than $0.00."}
        )
    if amount > 1000000.0:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": "Claim amount exceeds maximum single submission threshold ($1,000,000.00).", "details": "High value claims require manual underwriter authorization."}
        )
    if not policy_number or len(policy_number.strip()) < 3:
        raise HTTPException(
            status_code=400,
            detail={"success": False, "message": "Invalid or missing policy number.", "details": "Policy number must be provided."}
        )

def sanitize_extracted_text(text: str) -> str:
    """
    Sanitizes raw OCR extracted text against prompt injection attacks.
    Removes malicious instruction overrides embedded inside documents.
    """
    if not text:
        return ""

    sanitized = text
    for keyword in PROMPT_INJECTION_KEYWORDS:
        sanitized = re.sub(re.escape(keyword), f"[SANITIZED_INSTRUCTION]", sanitized, flags=re.IGNORECASE)

    return sanitized
