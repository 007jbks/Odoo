import os
from dotenv import load_dotenv
import cloudinary

cloud_api_key = os.getenv("CLOUDINARY_KEY")
cloud_api_secret = os.getenv("CLOUDINARY_SECRET")

cloudinary.config(
  cloud_name = "dhc8pzsgc",
  api_key = cloud_api_key,
  api_secret = cloud_api_secret,
  secure = True
)

