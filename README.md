# 🍦 CoolStock - Modern Ice Cream Wholesale & POS System

CoolStock is a full-stack, enterprise-grade Ice Cream Management system designed to bridge the gap between production, sales, and delivery. It features a modern, responsive interface for multiple roles, including Administrators, Managers, Cashiers, Delivery Staff, and Customers.

---

## 🚀 Key Features

### 🏢 Role-Based Dashboards
- **Administrator**: Full control over staff recruitment (approve applications), product management, and high-level analytics.
- **Manager**: Oversee daily operations, assign orders to delivery staff, manage inventory (restock/batch management), and monitor low stock.
- **Cashier**: Verify payments for deposited cash, manage in-store transactions, and finalize orders.
- **Delivery**: Mobile-optimized interface to track assigned deliveries, update transit status, and record cash deposits to cashiers.
- **Customer**: Browse the menu, place orders with various urgency levels, track live order progress, and manage personal profiles.

### 📦 Inventory & Batch Management
- **Smart Tracking**: Real-time stock monitoring with low-stock thresholds.
- **Batch Expiry Control**: Proactive alerts for products expiring soon and a **Bulk Removal** tool for expired stock to maintain safety and accuracy.
- **Automated Restocking**: Seamless flow for adding new batches with unique expiry dates.

### 📧 Automated Notification System
- **Real-time Updates**: Automated emails sent to customers for order confirmation, assignment, transit, and delivery.
- **Manager Alerts**: Proactive low-stock and expiry reports delivered to managers upon login.
- **HR Automation**: Automated welcome emails with system-generated credentials for accepted staff applicants.
- **Account Security**: Secure password reset flow with email verification codes.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ODM).
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing.
- **Notifications**: Nodemailer (SMTP Integration).

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas or Local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/YashKachaRK/CoolStock.git
cd CoolStock
```

### 2. Backend Setup
```bash
cd backed
npm install
```
Create a `.env` file in the `backed` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```
Run the server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📋 Order Lifecycle
`Ordered` (Customer) → `Assigned` (Manager) → `In Transit` (Delivery) → `Deposited` (Delivery) → `Paid` (Cashier)

---

## 📸 Project Architecture
- **Controllers**: Modular business logic for Auth, Orders, Products, and Staff.
- **Models**: Strict Mongoose schemas for data integrity.
- **Middleware**: Role-based access control and JWT verification.
- **Utils**: Centralized services like `emailService.js`.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📄 License
This project is licensed under the MIT License.

---
*Made with ❤️ by Team CoolStock*
