from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ingest, chat, generate, recommend

app = FastAPI(
    title="StudyBuddy AI Backend Engine",
    description="FastAPI service coordinating LangChain context retrievals and Groq structured models",
    version="1.0.0"
)

# Configure CORS policies to accept connections from React Native dev client connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ingest.router)
app.include_router(chat.router)
app.include_router(generate.router)
app.include_router(recommend.router)

@app.get("/")
def read_root():
    return {
        "status": "healthy",
        "service": "StudyBuddy AI Engine",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
