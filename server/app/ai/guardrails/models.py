from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field


class GuardrailViolationType(str, Enum):
    PROFANITY_ABUSE = "PROFANITY_ABUSE"
    PROMPT_INJECTION = "PROMPT_INJECTION"
    PII_LEAK = "PII_LEAK"
    SECRET_LEAK = "SECRET_LEAK"
    TOKEN_LIMIT_EXCEEDED = "TOKEN_LIMIT_EXCEEDED"


class GuardrailResult(BaseModel):
    is_safe: bool = Field(..., description="Whether the content passed safety guardrails.")
    violation_type: Optional[GuardrailViolationType] = Field(
        default=None, description="The category of guardrail violation if flagged."
    )
    reason: Optional[str] = Field(
        default=None, description="Detailed explanation of the safety violation."
    )
    sanitized_content: Optional[str] = Field(
        default=None, description="Sanitized or redacted version of the content."
    )
