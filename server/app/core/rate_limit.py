import asyncio
import time
from collections import defaultdict, deque
from typing import Dict, Deque
from fastapi import HTTPException, Request, status


class SlidingWindowRateLimiter:
    """In-memory sliding window rate limiter."""

    def __init__(self, requests_per_window: int = 5, window_seconds: int = 60):
        self.requests_per_window = requests_per_window
        self.window_seconds = window_seconds
        self.requests: Dict[str, Deque[float]] = defaultdict(deque)
        self._lock = asyncio.Lock()

    async def check(self, key: str) -> None:
        now = time.time()
        cutoff = now - self.window_seconds
        async with self._lock:
            user_requests = self.requests[key]
            while user_requests and user_requests[0] < cutoff:
                user_requests.popleft()

            if len(user_requests) >= self.requests_per_window:
                retry_after = int(user_requests[0] + self.window_seconds - now) + 1
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many requests. Please try again in {retry_after} seconds.",
                    headers={"Retry-After": str(retry_after)},
                )

            user_requests.append(now)


# Instantiated rate limiters for auth operations
auth_rate_limiter = SlidingWindowRateLimiter(requests_per_window=10, window_seconds=60)
email_rate_limiter = SlidingWindowRateLimiter(requests_per_window=3, window_seconds=60)


async def rate_limit_auth(request: Request) -> None:
    client_ip = request.client.host if request.client else "127.0.0.1"
    key = f"auth:{client_ip}"
    await auth_rate_limiter.check(key)


async def rate_limit_email(request: Request) -> None:
    client_ip = request.client.host if request.client else "127.0.0.1"
    key = f"email:{client_ip}"
    await email_rate_limiter.check(key)
