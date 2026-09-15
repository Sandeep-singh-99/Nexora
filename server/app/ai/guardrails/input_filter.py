from typing import Optional
from app.ai.guardrails.abuse import ABUSE_REGEX, PROMPT_INJECTION_REGEX, PII_REGEX
from app.ai.guardrails.models import GuardrailResult, GuardrailViolationType


class AbuseFilterError(Exception):
    """Raised when user input violates safety guardrails."""

    def __init__(
        self,
        message: str = "Your message contains prohibited content.",
        violation_type: Optional[GuardrailViolationType] = None,
    ):
        self.message = message
        self.violation_type = violation_type
        self.code = "CONTENT_BLOCKED"
        super().__init__(message)


def evaluate_input(text: str, max_length: int = 12000) -> GuardrailResult:
    """Evaluates user input against token length, profanity, prompt injection, and PII guardrails.
    
    Returns a GuardrailResult without throwing exceptions.
    """
    if not text or not text.strip():
        return GuardrailResult(is_safe=True)

    if len(text) > max_length:
        return GuardrailResult(
            is_safe=False,
            violation_type=GuardrailViolationType.TOKEN_LIMIT_EXCEEDED,
            reason=f"Input message exceeds maximum allowed length of {max_length} characters.",
        )

    # 1. Check Prompt Injection
    if PROMPT_INJECTION_REGEX.search(text):
        return GuardrailResult(
            is_safe=False,
            violation_type=GuardrailViolationType.PROMPT_INJECTION,
            reason="Your request was flagged for containing prompt injection or system override instructions.",
        )

    # 2. Check Abusive/Profane Content using Word Boundaries
    if ABUSE_REGEX.search(text):
        return GuardrailResult(
            is_safe=False,
            violation_type=GuardrailViolationType.PROFANITY_ABUSE,
            reason="Your message contains prohibited or inappropriate content.",
        )

    # 3. Check Sensitive PII
    if PII_REGEX.search(text):
        return GuardrailResult(
            is_safe=False,
            violation_type=GuardrailViolationType.PII_LEAK,
            reason="Your message contains sensitive personally identifiable information (PII).",
        )

    return GuardrailResult(is_safe=True)


def validate_input(text: str, max_length: int = 12000) -> GuardrailResult:
    """Validates user input. Throws AbuseFilterError if flagged, otherwise returns GuardrailResult."""
    result = evaluate_input(text, max_length=max_length)
    if not result.is_safe:
        raise AbuseFilterError(
            message=result.reason or "Your message contains prohibited content.",
            violation_type=result.violation_type,
        )
    return result