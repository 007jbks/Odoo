from fastapi import FastAPI, HTTPException, Header
from models import UserCreate,UserLogin,ItemCreate,ItemUpdate
from mongo import db
import bcrypt
import secrets
from cloud import cloudinary
import cloudinary.uploader
from bson import ObjectId
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

    # Generate auth token
    auth_token = secrets.token_hex(32)

    # Prepare the user document with default fields
    user_doc = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password,
        "auth_token": auth_token,
        "points": 100,  # Base points
        "reputation": 0.0,
        "sell_history": [],
        "buy_history": [],
        "address": user.address,
        "premium_status": False,
        "listing_number": 0
    }

    # Insert into MongoDB
    result = users_collection.insert_one(user_doc)

    return {
        "msg": "User registered successfully",
        "id": str(result.inserted_id),
        "token": auth_token
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

@app.post("/add_item")
def add_item(item: ItemCreate, token: str = Header(...)):
    user = get_current_user(token)
    uploader_id = str(user["_id"])

    # Check listing limit for free users
    if not user.get("premium_status", False) and user.get("listing_number", 0) >= 5:
        raise HTTPException(
            status_code=403,
            detail="Free-tier users can only list up to 5 items. Upgrade to premium to list more."
        )

    # Convert item to dict and attach uploader_id
    item_dict = item.dict()
    item_dict["uploader_id"] = uploader_id

    # Set default status
    if not item_dict.get("status"):
        item_dict["status"] = "Available"

    # Insert item into DB
    result = items.insert_one(item_dict)

    # Increment user's listing_number
    db["users"].update_one(
        {"_id": user["_id"]},
        {"$inc": {"listing_number": 1}}
    )

    return {
        "message": "Item uploaded successfully",
        "item_id": str(result.inserted_id)
    }


# Helper to get current user from token
def get_current_user(token: str = Header(...)):
    user = db["users"].find_one({"auth_token": token})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    user["_id"] = str(user["_id"])  # Ensure ObjectId is stringified
    return user


from fastapi import File, UploadFile

@app.post("/upload_image")
def upload_image(image: UploadFile = File(...)):
    # Upload to Cloudinary
    result = cloudinary.uploader.upload(image.file)
    
    # Get the secure URL
    image_url = result.get("secure_url")

    return {"image_url": image_url}

@app.get("/items/my")
def get_my_items(token: str = Header(...)):
    user = get_current_user(token)
    user_id = str(user["_id"])

    my_items = list(items.find({"uploader_id": user_id}))
    
    # Convert ObjectId to string
    for item in my_items:
        item["_id"] = str(item["_id"])

    return {
        "count": len(my_items),
        "items": my_items
    }

@app.put("/items/edit/{item_id}")
def edit_item(item_id: str, updates: ItemUpdate, token: str = Header(...)):
    user = get_current_user(token)
    user_id = str(user["_id"])

    # Validate item ID
    try:
        oid = ObjectId(item_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid item ID format")

    # Check if item exists and belongs to the user
    item = items.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item["uploader_id"] != user_id:
        raise HTTPException(status_code=403, detail="You are not allowed to edit this item")

    # Prepare update fields
    update_fields = {k: v for k, v in updates.dict().items() if v is not None}
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    # Perform update
    result = items.update_one({"_id": oid}, {"$set": update_fields})

    return {
        "message": "Item updated successfully",
        "modified_count": result.modified_count
    }