import os
import re
from fastapi import HTTPException, UploadFile

ALLOWED_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg"}
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

def validate_uploaded_file(file: UploadFile):
    """
    Validates uploaded document extension and file integrity.
    """
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, PNG, JPG, JPEG."
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
        # Case-insensitive replacement of prompt injection markers
        sanitized = re.sub(re.escape(keyword), f"[SANITIZED_INSTRUCTION]", sanitized, flags=re.IGNORECASE)

    return sanitized
