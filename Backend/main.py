from fastapi import FastAPI, HTTPException
from models import UserCreate,UserLogin
from mongo import db
import bcrypt
import secrets
from cloud import cloudinary
import cloudinary.uploader

app = FastAPI()
users_collection = db["users"]
items = db["items"]

@app.get("/hello")
def hello():
	return {"message":"Hello world"}

@app.post("/signup")
def signup(user: UserCreate):
    # Check if email or username already exists
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")

    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Generate auth token (optional but useful)
    auth_token = secrets.token_hex(32)

    # Prepare the user document
    user_doc = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "auth_token": auth_token
    }

    # Insert into MongoDB
    result = users_collection.insert_one(user_doc)

    return {
        "msg": "User registered successfully",
        "id": str(result.inserted_id),
        "token": auth_token  # Optional: Only if you're doing token-based auth
    }

@app.post("/login")
def login(user: UserLogin):
    query = {"email": user.email} if user.email else {"username": user.username}

    db_user = users_collection.find_one(query)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify password
    if not bcrypt.checkpw(user.password.encode(), db_user["password"].encode()):
        raise HTTPException(status_code=401, detail="Incorrect password")

    # Generate token (you could use JWT too)
    token = secrets.token_hex(32)

    # Store token in DB (optional for token invalidation)
    users_collection.update_one(query, {"$set": {"auth_token": token}})

    return {
        "message": "Login successful",
        "token": token,
        "user_id": str(db_user["_id"])
    }


