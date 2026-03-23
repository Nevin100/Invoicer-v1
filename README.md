# 🧾 Invoicer v1

<p align="center">
  <img width="1356" height="599" alt="image" src="https://github.com/user-attachments/assets/bc45767c-6e3d-4e3b-abb4-8f2675c35aa4" />
/>
</p>

> ⚡ A modern full-stack + GenAI - invoice & finance management platform  
> 🚧 Currently ~95% complete and under active development

---

# 📌 Overview

**Invoicer v1** is a production-structured financial management system designed for freelancers, startups, and small businesses.

It provides a complete workflow for:

- Invoice lifecycle management  
- Expense tracking & categorization  
- Client management  
- Secure online payments  
- Financial analytics dashboard  
- Structured data exports  

The architecture is designed to evolve into a scalable SaaS-ready financial operating system.

---

# 🏗️ Architecture

| Layer | Technology |
|-------|------------|
| Frontend | Next.js (App Router), React, TypeScript |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| State Management | Redux Toolkit |
| Validation | Zod |
| Authentication | JWT |
| Payments | Razorpay |
| CI/CD Pipelines | Github Actions | 
| Deployment | Vercel |
| Containerization | Dcoker |
| Caching | Redis |

---

# 📊 Development Status

| Module | Status |
|--------|--------|
| Authentication (JWT) | ✅ Completed |
| Dashboard UI | ✅ Completed |
| Expense Management | ✅ Completed |
| Client Management | ✅ Completed |
| Razorpay Integration | ✅ Completed |
| Excel Export | ✅ Completed |
| Financial Analytics | ✅ Completed |
| Invoice Creation | ✅ Completed |
| Invoice Emailing | ✅ Completed |
| Inventory Management | ✅ Completed |
| Google OAuth Integration | ✅ Completed |
| SAAS Service Credit System + Services Launch | ✅ Completed  |
| AI Insights | 🚧 In Progress |
| AI Report Generation | 🚧 In Progress |


**Overall Completion:** ~95%

---

# ✨ Features

## 🔐 Authentication & Security

- JWT-based authentication
- Password hashing using bcrypt
- Secure API routes
- User-scoped database access
- Zod schema validation
- Middleware protection

---

## 👥 Client Management

- Add, edit, delete clients
- Client-linked invoices
- Client-linked expenses
- Structured relational references

---

## 💸 Expense Management

- Add / edit / delete expenses
- Category-based tracking
- Date-based filtering
- Monthly aggregation logic
- Top spending category detection
- Dashboard integration
- Excel export functionality

---

## 🧾 Invoice System

- Dynamic invoice creation
- Auto-filled client billing section
- Multiple line items
- Tax & discount calculations
- Recurring invoice flag support
- Automatic invoice number generation
- Payment status tracking (Paid / Pending)

---

## 💳 Razorpay Payment Integration

- Secure order creation
- Payment verification
- Success & failure handling
- Invoice status auto-update

---

## 📊 Financial Analytics

- Monthly expense trends
- Client growth metrics
- Aggregated totals
- Interactive charts (Recharts)
- Responsive dashboard
- Skeleton loaders & empty states

---

## 📤 Data Export

- Export expenses to Excel
- Structured spreadsheet output
- Accounting-ready formatting

---

## 📱 Responsive Design

- Mobile-first layout
- Sidebar navigation system
- Adaptive dashboards
- Optimized for Desktop / Tablet / Mobile

---

# Future Scope (AI-First Vision)

Planned AI capabilities:

- Automatic expense categorization
- Spending pattern analysis
- Financial anomaly detection
- Predictive cash-flow insights
- Intelligent invoice reminders

Goal: Transform Invoicer into a smart financial assistant.

---

# 🛠️ Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts
- Radix UI
- Lucide Icons

### Backend
- Next.js API Routes
- MongoDB
- Mongoose
- JWT
- Zod
- Bcrypt

### State & Utilities
- Redux Toolkit
- React Hook Form
- Axios
- ExcelJS
- File Saver
- Date-Fns

---

# 📷 Images:
<img width="1366" height="599" alt="image" src="https://github.com/user-attachments/assets/950cb16e-4cf6-4e90-86db-059e67f4bada" />
<img width="1366" height="598" alt="image" src="https://github.com/user-attachments/assets/5262818b-0e42-44b4-8cc2-3578fbc330cc" />
<img width="1364" height="603" alt="image" src="https://github.com/user-attachments/assets/5f28cda6-766b-472a-8f3a-a5396cc0d548" />
<img width="1360" height="613" alt="image" src="https://github.com/user-attachments/assets/8d0ddd53-e849-4453-bb0f-fdc12714e6f8" />
<img width="1365" height="605" alt="image" src="https://github.com/user-attachments/assets/2c453f40-6b27-41eb-b90e-6764e6c6ec97" />
<img width="1366" height="603" alt="image" src="https://github.com/user-attachments/assets/7337e104-07f5-4475-bc74-9615146e2a78" />
<img width="1366" height="594" alt="image" src="https://github.com/user-attachments/assets/9cb7f1ab-75a5-4908-8c1e-9eefd3547182" />
<img width="1366" height="604" alt="image" src="https://github.com/user-attachments/assets/2d402da8-4c1c-4373-8764-6c020a22521b" />
<img width="1357" height="610" alt="image" src="https://github.com/user-attachments/assets/4b1878d5-0335-4819-8bf8-86817234f464" />


# ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/Nevin100/Invoicer-v1.git

# Navigate to project
cd Invoicer-v1

# Install dependencies
npm install

# Create.env file then paste the redentials required and then run 
npm run dev
```
