from pydantic import BaseModel, EmailStr
from typing import Optional,List    

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

    # Optional extended fields
    points: int = 0
    reputation: float = 0.0
    sell_history: List[str] = []  # list of item IDs sold
    buy_history: List[str] = []   # list of item IDs bought
    address: Optional[str] = None
    premium_status: bool = False
    listing_number :int = 0

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
    
class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    condition: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    status: Optional[str] = None
    date: Optional[str] = None
    image1url: Optional[str] = None
    image2url: Optional[str] = None
    image3url: Optional[str] = None
    image4url: Optional[str] = None