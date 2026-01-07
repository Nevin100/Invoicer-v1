# 🧾 Invoicer v1  
<img width="1366" height="607" alt="image" src="https://github.com/user-attachments/assets/ead70ada-6964-4147-84bc-dc65c4673ffa" className="align-center"/>

**Invoicer v1** is a modern, full-stack **monolithic invoice and finance management platform**, currently under active development and approximately **80–85% complete**.

The platform is designed to help individuals, freelancers, and small businesses manage **invoices, expenses, clients, payments, and analytics** from a multiple - responsive dashboard.

> 🚧 **Status:** Actively under development  
> 🌐 **Live Demo:** https://invoicer-taupe.vercel.app/login  
> 📦 **Repository:** https://github.com/Nevin100/Invoicer-v1  

---

## 🚀 Project Overview

Invoicer v1 aims to become a **complete financial operating system** for businesses by combining:

- Invoice lifecycle management
- Expense tracking & analytics
- Secure online payments
- Data exports & reporting
- Advanced authentication & authorization
- AI-powered financial insights (planned)

---

## 🏗️ Architecture

- **Project Type:** Monolithic Full-Stack Application  
- **Framework:** Next.js (App Router)  
- **Database:** MongoDB (Mongoose ODM)  
- **Deployment:** Vercel  
- **Authentication:** JWT (OAuth planned)

---

## 📊 Current Development Status (IMPORTANT)

| Module | Status |
|------|------|
| Authentication (JWT) | ✅ Completed |
| Dashboard UI & Layout | ✅ Completed |
| Financial Analytics | ✅ Completed |
| Expense Management | ✅ Completed |
| Razorpay Payment Integration | ✅ Completed |
| Excel Export (Expenses / Data) | ✅ Completed |
| Invoice Creation | 🚧 In Progress |
| Invoice Emailing | 🚧 In Progress |
| Inventory & Surplus Management | 🚧 In Progress |
| Advanced Authorization (RBAC) | 🔜 Planned |
| Google & Microsoft OAuth | 🔜 Planned |
| AI / ML Financial Insights | 🔜 Planned |

📌 **Overall Completion:** ~80–85%

---
## 📷 ScreenShots : 
<img width="1366" height="607" alt="image" src="https://github.com/user-attachments/assets/ead70ada-6964-4147-84bc-dc65c4673ffa" />
<img width="1354" height="604" alt="image" src="https://github.com/user-attachments/assets/032f8228-ae60-4eff-b568-1f14ed7aaa33" />
<img width="1360" height="614" alt="image" src="https://github.com/user-attachments/assets/9d6ef68d-53b0-4e38-837b-0d71a1edf509" />
<img width="1366" height="604" alt="image" src="https://github.com/user-attachments/assets/b80437b8-20df-4cf9-be8e-99547aaeec46" />
<img width="1366" height="602" alt="image" src="https://github.com/user-attachments/assets/83526aaf-20a8-417a-a077-6dc2b0ff2196" />
<img width="1355" height="603" alt="image" src="https://github.com/user-attachments/assets/0b660336-7869-4bfa-8c6c-e92ae029630b" />
<img width="1366" height="606" alt="image" src="https://github.com/user-attachments/assets/2b159f3a-7d25-4aea-91ed-a906a8e93e52" />
<img width="1353" height="557" alt="image" src="https://github.com/user-attachments/assets/7212db49-16e1-417b-b582-64f7f1ced0b0" />


## ✨ Key Features (Implemented)

### 🧾 Invoice Management
- Create and manage invoices
- Multiple billing categories
- Client-linked invoices
- Invoice emailing (in progress)

---

### 💸 Expense Management
- Add, edit & delete expenses
- Category-based tracking
- Monthly financial aggregation
- Top spending category insights

---

### 💳 Payments (Razorpay Integration)
- Secure online payments using **Razorpay**
- Payment flow integrated into invoice lifecycle
- Payment status handling (success / failure)

---

### 📊 Financial Analytics Dashboard
- Interactive charts (Clients vs Expenses)
- Monthly & yearly trends
- Clean loaders & empty states
- Real-time aggregated insights

---

### 📤 Data Export
- Export expenses & financial data to **Excel**
- Useful for accounting, auditing & reporting
- Structured spreadsheet output

---

### 👥 Client Management
- Add, update & delete clients
- Client-linked expenses & invoices
- Customer statistics & growth trends

---

### 📱 Responsive UI
- Fully responsive across:
  - Mobile
  - Tablet
  - Desktop
- Sidebar-based navigation
- Clean, modern dashboard layout

---

## 🔐 Authentication & Security

### Current
- JWT-based authentication
- Secure API routes
- User-scoped database access

### Planned
- Google OAuth
- Microsoft OAuth
- Role-based access control (RBAC)
- Advanced session handling

---

## 🤖 AI & Machine Learning (Future Scope)

The project is being developed with **AI-first thinking**:

- Gemini is currently used during development
- Planned **custom ML models** for:
  - Automatic expense categorization
  - Spending pattern analysis
  - Financial anomaly detection
  - Predictive insights for cash flow

---

## 🛠️ Tech Stack

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
- Zod (Validation)

### Utilities & Tools
- Axios
- Redux Toolkit
- React Hook Form
- ExcelJS
- File Saver
- Date-Fns
- Bcrypt

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/Nevin100/Invoicer-v1.git

# Navigate to project
cd Invoicer-v1

# Install dependencies
npm install

# Run development server
npm run dev
```
