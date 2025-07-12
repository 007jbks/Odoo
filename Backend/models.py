from pydantic import BaseModel, EmailStr
from typing import Optional

class UserCreate(BaseModel):
    username:str
    email:EmailStr
    password:str

class UserLogin(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str

class ItemCreate(BaseModel):
    name:str
    description:str
    condition:str
    category:str
    price:int
    status:str
    date:str
    image1url:str
    image2url: Optional[str] = None
    image3url: Optional[str] = None
    image4url: Optional[str] = None
    uploader_id:str
