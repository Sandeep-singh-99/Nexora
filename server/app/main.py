from fastapi import FastAPI

app = FastAPI(
    title="Nexora",
    version="1.0.0",
)


@app.get("/", tags=["Root"])
async def read_root():
    return {
        "message": "Welcome to the Nexora"
    }
