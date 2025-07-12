from fastapi import FastAPI, HTTPException, Header, Query
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
notifications_collection = db["notifications"]
import os
from dotenv import load_dotenv
load_dotenv()
email_pass = os.getenv("EMAIL_PASS")
@app.get("/hello")
def hello():
	return {"message":"Hello world"}
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def send_email(to_email: str, subject: str, body: str):
    msg = MIMEMultipart()
    msg["From"] = EMAIL_ADDRESS
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
    except Exception as e:
        print(f"Email sending failed to {to_email}: {e}")


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

    # If user is not premium, check and deduct points
    if not user.get("premium_status", False):
        if user.get("points", 0) < 20:
            raise HTTPException(
                status_code=403,
                detail="Insufficient points to list new item. Please buy more points."
            )
        # Deduct 20 points for the new listing
        db["users"].update_one(
            {"_id": user["_id"]},
            {"$inc": {"points": -20}}
        )

    # Convert item to dict and attach uploader_id
    item_dict = item.dict()
    item_dict["uploader_id"] = uploader_id

    # Set default status if not provided
    if not item_dict.get("status"):
        item_dict["status"] = "Available"

    # Insert item into DB
    result = items.insert_one(item_dict)

    # Optionally return updated points balance for non-premium users
    remaining_points = user.get("points", 0)
    if not user.get("premium_status", False):
        remaining_points -= 20

    return {
        "message": "Item uploaded successfully",
        "item_id": str(result.inserted_id),
        "remaining_points": remaining_points if not user.get("premium_status", False) else "Unlimited (Premium user)"
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

    # Clean all ObjectIds
    my_items = [clean_object_ids(item) for item in my_items]

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

@app.get("/dashboard")
def dashboard(token: str = Header(...)):
    user = get_current_user(token)

    # Format the response - convert ObjectIds in histories to strings if needed
    # Assuming sell_history and buy_history are lists of item IDs (strings or ObjectIds)
    sell_history = [str(item_id) for item_id in user.get("sell_history", [])]
    buy_history = [str(item_id) for item_id in user.get("buy_history", [])]

    return {
        "username": user.get("username"),
        "email": user.get("email"),
        "points": user.get("points", 0),
        "reputation": user.get("reputation", 0.0),
        "sell_history": sell_history,
        "buy_history": buy_history,
        "address": user.get("address"),
        "premium_status": user.get("premium_status", False),
        "listing_number": user.get("listing_number", 0)
    }


from datetime import datetime

EMAIL_ADDRESS = "jon00doe00297@gmail.com"
EMAIL_PASSWORD = os.getenv("EMAIL_PASS")

@app.post("/buy_item/{item_id}")
def buy_item(item_id: str, token: str = Header(...)):
    user = get_current_user(token)
    user_id = str(user["_id"])

    try:
        oid = ObjectId(item_id)
    except:
        raise HTTPException(400, "Invalid item ID")

    item = items.find_one({"_id": oid, "status": "Available"})
    if not item:
        raise HTTPException(404, "Item not available")

    price = item["original_price"]
    if user["points"] < price:
        raise HTTPException(403, "Insufficient points")

    seller_id = item["uploader_id"]
    if seller_id == user_id:
        raise HTTPException(400, "Cannot buy your own item")

    # Create a purchase request notification for seller approval
    notification_doc = {
        "type":"purchase",
        "user_id": seller_id,
        "item_id": item_id,
        "buyer_id": user_id,
        "message": f"{user['username']} wants to buy your item: {item['name']}",
        "status": "pending",
        "read": False,
        "timestamp": datetime.utcnow()
    }
    notifications_collection.insert_one(notification_doc)

    # Send email to the seller
    seller = users_collection.find_one({"_id": ObjectId(seller_id)})
    if seller and seller.get("email"):
        subject = "New Purchase Request on Your Listing"
        body = f"""
        Hello {seller['username']},

        {user['username']} is interested in buying your item "{item['name']}".

        Please log in to your dashboard to approve or decline this request.

        Thank you,
        Your Marketplace Team
        """
        send_email(seller["email"], subject, body)

    return {"message": "Purchase request sent to seller. Awaiting approval."}

@app.get("/notifications/purchase_requests")
def get_purchase_requests(token: str = Header(...)):
    user = get_current_user(token)
    user_id = str(user["_id"])

    requests = list(notifications_collection.find({"user_id": user_id, "status": "pending"}))
    for r in requests:
        r["_id"] = str(r["_id"])
        r["timestamp"] = r["timestamp"].isoformat()
    return {"count": len(requests), "requests": requests}


@app.post("/notifications/purchase_requests/{notification_id}/respond")
def respond_purchase_request(notification_id: str, approve: bool, token: str = Header(...)):
    user = get_current_user(token)
    user_id = str(user["_id"])

    try:
        oid = ObjectId(notification_id)
    except:
        raise HTTPException(400, "Invalid notification ID")

    notif = notifications_collection.find_one({"_id": oid})
    if not notif or notif["user_id"] != user_id:
        raise HTTPException(404, "Notification not found or not yours")

    if notif["status"] != "pending":
        raise HTTPException(400, "Request already handled")

    buyer = users_collection.find_one({"_id": ObjectId(notif["buyer_id"])})
    item = items.find_one({"_id": ObjectId(notif["item_id"])})

    if not buyer or not item:
        raise HTTPException(404, "Buyer or item not found")

    if approve:
        if notif.get("type") == "swap":
            offered_item = items.find_one({"_id": ObjectId(notif["offered_item_id"]), "uploader_id": notif["buyer_id"]})
            if not offered_item or offered_item["status"] != "Available":
                raise HTTPException(404, "Offered item not available")

            # Handle point transfer if needed
            price_diff = notif.get("price_diff", 0)
            if price_diff > 0:
                res = users_collection.update_one(
                    {"_id": buyer["_id"], "points": {"$gte": price_diff}},
                    {"$inc": {"points": -price_diff}}
                )
                if res.modified_count == 0:
                    raise HTTPException(403, "Buyer has insufficient points")

                users_collection.update_one({"_id": ObjectId(user_id)}, {"$inc": {"points": price_diff}})

            # Swap item ownerships
            items.update_one({"_id": item["_id"]}, {"$set": {"uploader_id": notif["buyer_id"], "status": "Swapped"}})
            items.update_one({"_id": offered_item["_id"]}, {"$set": {"uploader_id": user_id, "status": "Swapped"}})

            # Update histories
            users_collection.update_one(
                {"_id": buyer["_id"]},
                {"$push": {"buy_history": notif["item_id"]}}
            )
            users_collection.update_one(
                {"_id": ObjectId(user_id)},
                {"$push": {"sell_history": notif["item_id"]}}
            )

            message = "Swap approved and completed."
            notifications_collection.update_one({"_id": oid}, {"$set": {"status": "approved", "read": True}})
            return {"message": message}
        else:
                # Deduct points from buyer
            users_collection.update_one(
            {"_id": buyer["_id"]},
            {"$inc": {"points": -item["original_price"]}, "$push": {"buy_history": str(item["_id"])}}
        )

        # Add points to seller
            users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$inc": {"points": item["original_price"]}, "$push": {"sell_history": str(item["_id"])}}
        )

        # Mark item as sold
            items.update_one(
            {"_id": item["_id"]},
            {"$set": {"status": "Sold", "buyer_id": buyer["_id"]}}
        )

            message = "Purchase request approved and completed."

            notifications_collection.update_one({"_id": oid}, {"$set": {"status": "approved", "read": True}})
            return {"message": message}

    else:
            notifications_collection.update_one({"_id": oid}, {"$set": {"status": "disapproved", "read": True}})
            return {"message": "Request disapproved."}

@app.post("/swap_item/{item_id}")
def swap_item(item_id: str, offered_item_id: str, token: str = Header(...)):
    user = get_current_user(token)
    buyer_id = str(user["_id"])

    # Validate ObjectIds
    try:
        target_oid = ObjectId(item_id)
        offered_oid = ObjectId(offered_item_id)
    except:
        raise HTTPException(400, "Invalid item IDs")

    # Fetch items
    target_item = items.find_one({"_id": target_oid, "status": "Available"})
    offered_item = items.find_one({"_id": offered_oid, "uploader_id": buyer_id, "status": "Available"})

    if not target_item or not offered_item:
        raise HTTPException(404, "Item not found or unavailable")

    seller_id = target_item["uploader_id"]
    if seller_id == buyer_id:
        raise HTTPException(400, "Cannot swap with your own item")

    # Calculate point difference
    price_diff = target_item["original_price"] - offered_item["original_price"]
    if price_diff > 0 and user["points"] < price_diff:
        raise HTTPException(403, "Insufficient points to complete the swap")

    # Insert swap notification
    notif_doc = {
        "type": "swap",
        "user_id": seller_id,
        "buyer_id": buyer_id,
        "item_id": item_id,
        "offered_item_id": offered_item_id,
        "message": f"{user['username']} wants to swap for your item: {target_item['name']}",
        "price_diff": price_diff,
        "status": "pending",
        "read": False,
        "timestamp": datetime.utcnow()
    }
    notifications_collection.insert_one(notif_doc)

    # Email seller
    seller = users_collection.find_one({"_id": ObjectId(seller_id)})
    if seller and seller.get("email"):
        subject = "Swap Request for Your Listing"
        body = f"""
        Hello {seller['username']},

        {user['username']} wants to swap their item "{offered_item['name']}" for your item "{target_item['name']}".

        Point difference: {price_diff if price_diff > 0 else 'No extra payment required'}.

        Please log in to your dashboard to approve or reject this request.

        Regards,
        Your Marketplace Team
        """

        send_email(seller["email"], subject, body)

    return {"message": "Swap request sent. Awaiting seller's response."}

def clean_object_ids(doc):
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)
        elif isinstance(value, list):
            doc[key] = [str(v) if isinstance(v, ObjectId) else v for v in value]
        elif isinstance(value, dict):
            doc[key] = clean_object_ids(value)
    return doc

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
admin_token = os.getenv("ADMIN_TOKEN")

@app.post("/admin/login")
def admin_login(username: str, password: str):
    global admin_token
    if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
        # Generate a fresh token on every login
        admin_token = secrets.token_hex(32)
        return {"message": "Admin login successful", "token": admin_token}
    raise HTTPException(status_code=401, detail="Invalid admin credentials")

def verify_admin(token: str = Header(...)):
    if token != admin_token:
        raise HTTPException(status_code=403, detail="Unauthorized: Invalid admin token")
    return True

@app.get("/admin/users")
def get_all_users(token: str = Header(...)):
    verify_admin(token)  # Validate token
    
    users = list(users_collection.find())

    # Clean up ObjectIds and passwords before sending
    cleaned_users = []
    for user in users:
        user["_id"] = str(user["_id"])
        user.pop("password", None)  # Never expose password hash
        cleaned_users.append(user)

    return {
        "count": len(cleaned_users),
        "users": cleaned_users
    }
@app.get("/admin/items")
def get_all_items(token: str = Header(...)):
    verify_admin(token)  # Validate admin token

    all_items = list(items.find())

    # Clean up ObjectIds for JSON compatibility
    cleaned_items = []
    for item in all_items:
        item["_id"] = str(item["_id"])
        item["uploader_id"] = str(item["uploader_id"])
        if "buyer_id" in item:
            item["buyer_id"] = str(item["buyer_id"])
        cleaned_items.append(item)

    return {
        "count": len(cleaned_items),
        "items": cleaned_items
    }

@app.post("/admin/item/{item_id}/review")
def admin_review_item(
    item_id: str,
    approve: bool = Query(..., description="Set true to approve, false to disapprove"),
    token: str = Header(...)
):
    verify_admin(token)

    try:
        oid = ObjectId(item_id)
    except:
        raise HTTPException(400, "Invalid item ID")

    item = items.find_one({"_id": oid})
    if not item:
        raise HTTPException(404, "Item not found")

    uploader_id = item.get("uploader_id")
    user = users_collection.find_one({"_id": ObjectId(uploader_id)})

    if not user:
        raise HTTPException(404, "Uploader not found")

    new_status = "approved" if approve else "disapproved"
    items.update_one({"_id": oid}, {"$set": {"admin_status": new_status}})

    # Send email notification
    subject = f"Item {new_status.capitalize()}"
    body = f"""
    Hello {user['username']},

    Your item listing titled "{item['name']}" has been {new_status} by the admin.

    Regards,
    Admin Team
    """
    send_email(user["email"], subject, body)

    return {"message": f"Item {new_status} and email sent"}
