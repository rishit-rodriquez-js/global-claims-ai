import re

def mask_pii(text: str) -> str:
    """
    Masks PII patterns:
    - Phone numbers: e.g., +1 (555) 123-4567 -> +1 (555) ***-4567
    - Emails: e.g., john.doe@example.com -> j***e@example.com
    - SSN / National IDs: e.g., 123-45-6789 -> XXX-XX-6789
    - Credit/Bank numbers: e.g., 4532 1198 8821 9012 -> **** **** **** 9012
    """
    if not text:
        return text

    # SSN Pattern
    text = re.sub(r'\b\d{3}-\d{2}-(\d{4})\b', r'XXX-XX-\1', text)

    # Phone Pattern
    text = re.sub(r'(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?(\d{4})', r'\1(***) ***-\2', text)

    # Email Pattern
    def mask_email(match):
        user, domain = match.group(1), match.group(2)
        if len(user) > 2:
            masked_user = user[0] + "***" + user[-1]
        else:
            masked_user = "***"
        return f"{masked_user}@{domain}"

    text = re.sub(r'\b([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b', mask_email, text)

    # Credit Card Pattern
    text = re.sub(r'\b(?:\d[ -]*?){13,16}\b', r'**** **** **** \1', text)

    return text
