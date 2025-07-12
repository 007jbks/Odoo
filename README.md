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

git clone https://www.github.com/007jbks/Odoo
cd Odoo

### 2️⃣ Backend Setup (FastAPI)
📦 Install Dependencies

cd backend
pip install -r requirements.txt
### 📁 Create .env file
Create a .env file in the backend/ directory with the following content:
MONGO_URI
MONGO_DB_NAME
CLOUDINARY_KEY 
CLOUDINARY_SECRET
EMAIL_PASS
ADMIN_USERNAME
ADMIN_PASSWORD
ADMIN_TOKEN
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

## The Smart Contract
This smart contract is designed for centralized platforms where a backend service controls user balances.

All balance changes (additions and subtractions) are transparent and recorded on-chain via events.

Wallet addresses are deterministically generated per userId to maintain uniqueness and predictability.

No ERC-20 or token transfer logic is included — this is a ledger-style accounting system only.

Ideal for use cases such as:

Reward points or loyalty systems

Internal e-commerce credits

Non-transferable digital tokens

Compatible with backend event listeners to sync blockchain state with off-chain databases.

Ownership control ensures that only the platform administrator (owner) can modify balances or register wallets.

## 🚀 How to Use the smart contract

Follow these steps to deploy and interact with the ECommerceWallet smart contract:

### 1. Deploy the Contract

Deploy the ECommerceWallet contract using Remix, Hardhat, Foundry, or any other Solidity development tool.

- Make sure you are using Solidity version 0.8.28.
- The deployer becomes the contract owner.

Example using Remix:

1. Paste the contract code into a new `.sol` file.
2. Compile using Solidity 0.8.28.
3. Deploy the `ECommerceWallet` contract.

---

### 2. Create a Wallet for a User

Use the `createWallet` function to register a wallet address for a user:

```solidity
ecommerceWallet.createWallet("user123@example.com");
```

- This generates a unique address for the user and maps it to their userId.
- Emits `WalletCreated` event.

---

### 3. Add Tokens to a User's Balance

Add tokens by user address:

```solidity
ecommerceWallet.addTokens(0xUserAddress, 1000);
```

Or by userId (recommended):

```solidity
ecommerceWallet.addTokensByUserId("user123@example.com", 1000);
```

- Emits `TokensAdded` event with updated balance.

---

### 4. Subtract Tokens from a User's Balance

Subtract tokens by user address:

```solidity
ecommerceWallet.subtractTokens(0xUserAddress, 500);
```

Or by userId:

```solidity
ecommerceWallet.subtractTokensByUserId("user123@example.com", 500);
```

- Emits `TokensSubtracted` event.

---

### 5. Query Balances

Check balance by address:

```solidity
uint256 balance = ecommerceWallet.getBalance(0xUserAddress);
```

Or by userId:

```solidity
uint256 balance = ecommerceWallet.getBalanceByUserId("user123@example.com");
```

---

### 6. Transfer Ownership

To transfer ownership to another address:

```solidity
ecommerceWallet.transferOwnership(0xNewOwner);
```

- Only callable by the current owner.


---

## 🌐 Environment Configuration

Create a .env file in your root directory with the following values:

```dotenv
# Alchemy Sepolia RPC URL
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-alchemy-api-key

# Private key of the signer wallet
PRIVATE_KEY=your-wallet-private-key

# Deployed contract address
CONTRACT_ADDRESS=0x7d1aA1C96b9c4FD03a35aE45BfB91655e769F713

# Port for the Express server
PORT=3000
```

## Express API Routes 
| Method | Route                     | Description                   |
| ------ | ------------------------- | ----------------------------- |
| POST   | /wallet/create            | Create a wallet for a user ID |
| GET    | /wallet/balance/\:address | Get balance by address        |
| GET    | /wallet/user/\:userId     | Get balance by user ID        |
| POST   | /wallet/add               | Add tokens to a wallet        |
| POST   | /wallet/subtract          | Subtract tokens from a wallet |
| GET    | /wallet/exists/\:address  | Check if wallet is registered |


