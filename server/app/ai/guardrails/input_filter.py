from app.ai.guardrails.abuse import abuse

class AbuseFilterError(Exception):
    def __init__(self, message: str = "Your message contains prohibited content."):
        self.message = message
        super().__init__(message)

def validate_input(text: str) -> None:
    lowered = text.lower()
    for keyword in abuse:
        if keyword.lower() in lowered:
            raise AbuseFilterError("Your message contains prohibited content.")