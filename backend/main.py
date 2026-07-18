from fastapi import FastAPI
from database import Base, engine
import models.user
from routers.auth import router as auth_router
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends
from security import verify_token

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CloudNotes API",
    version="1.0.0"
)
security = HTTPBearer()
app.include_router(auth_router)

@app.get("/")
def home():
    return {"message": "🚀 Welcome to CloudNotes API"}

@app.get("/health")
def health():
    return {"status": "Server Running Successfully"}

@app.get("/me")
def get_me(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    payload = verify_token(credentials.credentials)

    return {
        "message": "Protected Route",
        "user": payload
    }