import re
from app.ai.guardrails.models import GuardrailResult, GuardrailViolationType

# Regex patterns for detecting leaked secrets, API keys, and sensitive tokens
SECRET_PATTERNS = [
    r"\bgroq_[a-zA-Z0-9_-]{20,}\b",
    r"\bsk-(?:proj-)?[a-zA-Z0-9_-]{20,}\b",
    r"\bAIzaSy[a-zA-Z0-9_-]{33}\b",
    r"-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----",
    r"\b(?:postgres|mysql|mongodb|redis):\/\/[^\s'\"]+\b",
]

SECRET_REGEX = re.compile("|".join(SECRET_PATTERNS), re.IGNORECASE)

# System instruction disclosure signatures
SYSTEM_LEAK_PATTERNS = [
    r"You are Nexora's (general|software engineering|research) assistant",
    r"Analyze the user request and choose the appropriate agent",
]

SYSTEM_LEAK_REGEX = re.compile("|".join(SYSTEM_LEAK_PATTERNS), re.IGNORECASE)


def validate_output(text: str) -> GuardrailResult:
    """Scans agent output for sensitive secret leaks or system instruction disclosure."""
    if not text or not text.strip():
        return GuardrailResult(is_safe=True)

    # 1. Check for API keys or credentials
    if SECRET_REGEX.search(text):
        sanitized = SECRET_REGEX.sub("[REDACTED_SECRET]", text)
        return GuardrailResult(
            is_safe=False,
            violation_type=GuardrailViolationType.SECRET_LEAK,
            reason="Output contains sensitive API keys or credentials.",
            sanitized_content=sanitized,
        )

    # 2. Check for internal system instruction leakage
    if SYSTEM_LEAK_REGEX.search(text):
        return GuardrailResult(
            is_safe=False,
            violation_type=GuardrailViolationType.SECRET_LEAK,
            reason="Output contains internal system instructions.",
            sanitized_content="[I am Nexora, your AI assistant. How can I help you today?]",
        )

    return GuardrailResult(is_safe=True, sanitized_content=text)
