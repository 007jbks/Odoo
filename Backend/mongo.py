# mongo.py
import os
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME")

client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
client.admin.command("ping")  # Handshake
db = client[DB_NAME]
