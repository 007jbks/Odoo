# 🧥 ReWear – Community Clothing Exchange

### ♻️ Overview
ReWear is a web-based platform that empowers users to exchange their unused clothing through either **direct swaps** or a **point-based system**. The initiative promotes **sustainable fashion** and aims to reduce textile waste by encouraging users to reuse wearable garments instead of discarding them.

---

### 👥 Team: AlgoRhythm

- **Leader:** kartik.orion.dev@gmail.com  
- samairawahiwork@gmail.com  
- workwithdeepnav@gmail.com  
- poddarayush52@gmail.com

---

## 🚀 Features

- 🧾 **User Signup/Login** with token-based authentication
- 🧥 **List Items** with images, size, category, and condition
- 🔁 **Swap Requests**: Send/receive swap offers with other users
- 💰 **Purchase Items** using platform points
- 🧑‍⚖️ **Admin Approval System**: All listings go through an approval workflow
- 🔔 **Notifications System**: For swap/purchase requests
- 📬 **Email Alerts**: For purchases, swaps, admin decisions
- 🔎 **Browse & Filter** items by category
- 📦 **My Listings** dashboard for managing personal uploads
- 📈 **User Dashboard** showing reputation, point balance, history
- 🪪 **Premium Users** can list items without point deduction
- 💳 **Top-Up Points** using real money via payment gateway (Node.js wallet)

---

## 🧠 Tech Stack

### 💻 Frontend
- **React.js**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Cloudinary** (for image uploads)

### 🛠️ Backend (API)
- **FastAPI** (Python)
- **MongoDB** (with PyMongo)
- **Cloudinary** (image uploads)
- **SMTP Email** (via Gmail SMTP)
- **bcrypt** (for password hashing)
- **dotenv** (for secrets & environment config)

### 💳 Wallet Microservice
- **Node.js** with **Express**

---

## 💳 Points System

- 🔰 Users begin with **100 points**
- 🧾 Listing an item costs **20 points** (free for premium users)
- 🛒 Items can be bought using points (based on `original_price`)
- 🔁 Swap requests can be made; if value differs, **point difference must be paid**
- ✅ **Users can top up points using real money** via integrated payment service

---

## 🔐 Admin Panel Features

- Admin login with secure token
- View all users & listings
- Approve/disapprove items with reasons
- Trigger email notifications for approvals

---

## 📦 API Highlights

- `POST /signup`, `POST /login`
- `POST /add_item`, `PUT /items/edit/{id}`
- `GET /items`, `GET /items/my`
- `POST /buy_item/{id}`
- `POST /swap_item/{id}`
- `GET /notifications/purchase_requests`
- `POST /notifications/purchase_requests/{id}/respond`
- `POST /admin/item/{id}/review`

---

## 📬 Email Integration

- Users receive email alerts on:
  - Purchase requests
  - Swap offers
  - Admin approval or disapproval of listings

---

## 🛠️ How to Use

This section explains how to set up the ReWear platform locally for development and testing.

---

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/rewear.git
cd rewear 

### 2️⃣ Backend Setup (FastAPI)
📦 Install Dependencies

cd backend
pip install -r requirements.txt
### 📁 Create .env file
Create a .env file in the backend/ directory with the following content:

EMAIL_PASS=your_gmail_app_password
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
ADMIN_TOKEN=your_secret_admin_token
### ▶️ Run the Backend Server

uvicorn main:app --reload
API should now be accessible at: http://localhost:8000

3️⃣ Frontend Setup (React.js)
### 📦 Install Dependencies
cd frontend
npm install
### ▶️ Run the Frontend Development Server
npm start
App will be running at: http://localhost:5173





