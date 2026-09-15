import re

# Abusive, profane, and toxic terms matched using word boundaries (\b)
# to prevent false positives on words like "shift" (shit) or "whatever" (hate).
ABUSE_KEYWORDS = [
    "idiot",
    "stupid",
    "dumb",
    "moron",
    "fool",
    "loser",
    "shut up",
    "bastard",
    "asshole",
    "bitch",
    "fuck",
    "fucking",
    "shit",
    "bullshit",
    "cunt",
    "dickhead",
]

# Compiled Regex for word boundary profanity checking
ABUSE_REGEX = re.compile(
    r"\b(" + "|".join(re.escape(word) for word in ABUSE_KEYWORDS) + r")\b",
    re.IGNORECASE,
)

# Common Prompt Injection & Jailbreak patterns
PROMPT_INJECTION_PATTERNS = [
    r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions",
    r"disregard\s+(all\s+)?(previous|prior|above)\s+instructions",
    r"forget\s+(all\s+)?(previous|prior|system)\s+instructions",
    r"bypass\s+(safety|content)\s+filters",
    r"you\s+are\s+now\s+in\s+dan\s+mode",
    r"reveal\s+(your\s+)?(system\s+prompt|developer\s+mode|instructions)",
    r"print\s+(your\s+)?(system\s+prompt|environment\s+variables|api\s+key)",
    r"override\s+system\s+(prompt|rules)",
]

PROMPT_INJECTION_REGEX = re.compile(
    "|".join(PROMPT_INJECTION_PATTERNS),
    re.IGNORECASE,
)

# Sensitive PII & Credential regex patterns
PII_PATTERNS = [
    r"\b\d{3}-\d{2}-\d{4}\b",  # SSN
    r"\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\b",  # Credit Card
]

PII_REGEX = re.compile(
    "|".join(PII_PATTERNS),
    re.IGNORECASE,
)

# Backwards compatibility export
abuse = ABUSE_KEYWORDS