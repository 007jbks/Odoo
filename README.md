# 🧥 ReWear – Community Clothing Exchange

## 🔍 Overview

**ReWear** is a web-based platform that promotes sustainable fashion by allowing users to **exchange unused clothing** through **direct swaps** or a **point-based redemption system**. Our aim is to reduce textile waste and encourage conscious consumption by reusing wearable garments rather than discarding them.

---

## 👥 Team: AlgoRhythm

- **Team Leader**: kartik.orion.dev@gmail.com  
- samairawahiwork@gmail.com  
- workwithdeepnav@gmail.com  
- poddarayush52@gmail.com  

---

## ⚙️ Tech Stack

### 🔧 Backend (FastAPI)
- Python 3.11 with FastAPI
- MongoDB (with PyMongo)
- Cloudinary (image hosting)
- Bcrypt (password hashing)
- SMTP (email notifications)
- JWT-like token-based session management

### 💻 Frontend (React)
- ReactJS
- TailwindCSS for styling
- React Router for navigation
- Axios for API communication

### 💰 Wallet System (Node.js Microservice)
- Node.js with Express
- MongoDB
- Manages point transactions for:
  - Buying items
  - Deducting listing fees
  - Handling swap point differences

---

## 🚀 Features

### 🧑‍💼 User Management
- User **signup** with email/username & secure password
- **Login** using username or email
- Token-based session system
- Point-based system for item listings and purchases
- Premium status support with unlimited listings

---

### 📦 Item Listing & Management
- Upload clothing items with images, condition, category, etc.
- Cloudinary image uploads via `/upload_image`
- Edit and view user-specific listed items (`/items/my`)
- Automatic status management: `Available`, `Sold`, `Swapped`

---

### 🛒 Marketplace Logic
- Users can **buy items** with points  
- Buyers can also **request swaps** with their own listed items  
- Secure transaction system with admin & seller approvals

---

### 🔔 Notifications System
- Sellers receive **purchase or swap requests**
- Sellers can **approve or disapprove** via dashboard
- Real-time request handling via `/notifications/purchase_requests`
- Email alerts for every action

---

### 🛠 Admin Panel
- Admin login with credentials from `.env`
- Admin can:
  - View all users and items
  - **Approve or disapprove listings**
  - Email notification to users for listing decisions

---

### 📊 User Dashboard
- See your current:
  - Points
  - Premium status
  - Reputation
  - Address
  - Buy/sell history

---

### 📤 Email Notifications
- SMTP-based notifications for:
  - Purchase requests
  - Swap requests
  - Admin approvals or disapprovals

---

## 🛡️ Security
- Passwords hashed with **bcrypt**
- Secure tokens for session management
- Admin actions restricted via token-based validation

---

