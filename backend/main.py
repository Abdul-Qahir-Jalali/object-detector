from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import models, schemas, auth_utils, database

# Create tables if they don't exist
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    if len(user.username) < 5:
        raise HTTPException(status_code=400, detail="Username must be at least 5 characters long")
    if " " in user.username:
        raise HTTPException(status_code=400, detail="Username cannot contain spaces")
    if len(user.password) < 5:
        raise HTTPException(status_code=400, detail="Password must be at least 5 characters long")
    if " " in user.password:
        raise HTTPException(status_code=400, detail="Password cannot contain spaces")

    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    hashed_password = auth_utils.get_password_hash(user.password)
    new_user = models.User(username=user.username, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(database.get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    if not auth_utils.verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    return {"message": "Login successful", "username": db_user.username}

# Proxy Endpoints for External AI Model
import httpx
import os
from pydantic import BaseModel

TRAIN_CONFIG_URL = os.getenv("TRAIN_CONFIG_URL")
UPDATE_CONFIG_URL = os.getenv("UPDATE_CONFIG_URL")
START_TRAINING_URL = os.getenv("START_TRAINING_URL")
EXTERNAL_PREDICTOR_API = os.getenv("EXTERNAL_PREDICTOR_API")

@app.get("/train/config")
async def get_train_config():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(TRAIN_CONFIG_URL)
            if response.status_code != 200:
                # Fallback or error? For now let's error if external is down to be honest
                raise HTTPException(status_code=response.status_code, detail="External Config Error")
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

class TrainingParams(BaseModel):
    model: str
    classes: int
    epochs: int
    batchSize: int
    lr: float
    augmentation: bool

@app.post("/train/config")
async def update_train_config(params: TrainingParams):
    async with httpx.AsyncClient() as client:
        try:
             response = await client.post(UPDATE_CONFIG_URL, json=params.dict())
             if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="External Update Error")
             return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/train/start")
async def start_training():
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(START_TRAINING_URL)
            if response.status_code != 200:
                raise HTTPException(status_code=response.status_code, detail="External Start Training Error")
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    async with httpx.AsyncClient() as client:
        try:
            # Read file content
            content = await file.read()
            # Prepare file for upload
            files = {'file': (file.filename, content, file.content_type)}
            
            # Forward to external API
            response = await client.post(EXTERNAL_PREDICTOR_API, files=files)
            if response.status_code != 200:
                 raise HTTPException(status_code=response.status_code, detail="External API Error")
            return response.json()
            
            # Mock Response removed
            # return {"label": "YOLO_OBJECT", "confidence": 0.98}
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
