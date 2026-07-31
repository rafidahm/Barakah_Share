# 🌿 BarakahShare — University Resource Sharing Platform

> A MERN-stack platform designed specifically for the IIUC academic community to donate, lend, borrow, and request resources — spreading barakah one share at a time.

---

## 🚀 Unique Platform Highlights
* **Closed-Loop Academic Trust:** Enforces registration and authentication checks using only verified institutional domains (`@ugrad.iiuc.ac.bd` and `@iiuc.ac.bd`).
* **Hybrid Identity Engine:** Seamlessly links standard email/password logins with Google OAuth login into a unified MongoDB account without losing statistics or contributions.
* **Dual-Lifecycle State Tracker:** Enforces strict transaction transitions for permanently donated goods versus temporarily lent items.
* **Administrative Analytics:** Live data charts tracking monthly trends, category splits, and user engagement metrics directly from actual platform transactions.

---

## 📁 Project Architecture & Monorepo Structure

```
g:\BaraqahShare\
├── frontend/          ← React + Vite + Vanilla CSS
│   ├── src/
│   │   ├── assets/         ← UI graphics & illustrations
│   │   ├── components/     ← Modular UI components
│   │   │   ├── common/     ← Navbar, Footer, Badge, Modal, Spinner, ConfirmDialog
│   │   │   ├── charts/     ← CategoryPieChart, DonationTrendChart, BorrowingTrendChart
│   │   │   ├── dashboard/  ← DashboardSidebar
│   │   │   ├── home/       ← HeroSection, StatsCounter, FeaturedItems, HowItWorks
│   │   │   ├── items/      ← ItemCard, ItemGrid, ItemFilters, ItemForm
│   │   │   └── reviews/    ← StarRating, ReviewCard, ReviewForm
│   │   ├── context/        ← AuthContext, AppContext (global data layer)
│   │   ├── hooks/          ← useToast.jsx
│   │   ├── pages/
│   │   │   ├── auth/       ← Login, Register
│   │   │   ├── admin/      ← AdminDashboard (Responsive layout, horizontal scroll)
│   │   │   ├── public/     ← Home, Items, ItemDetail, About, Contact, NotFound
│   │   │   └── user/       ← UserDashboard (My items, requested listings)
│   │   ├── routes/         ← AppRouter, PrivateRoute, AdminRoute
│   │   └── utils/          ← helpers.js
│   └── package.json
│
└── backend/           ← Node.js + Express + MongoDB
    ├── config/         ← db.js (Mongoose connection), firebase.js (Admin SDK Init)
    ├── controllers/    ← authController, itemController, requestController, reviewController
    ├── middleware/     ← verifyToken (JWT + Firebase provider), verifyAdmin
    ├── models/         ← User, Item, Request, Review (Mongoose schemas)
    ├── routes/         ← authRoutes, itemRoutes, requestRoutes, reviewRoutes
    └── server.js       ← Express application entry point
```

---

## 🔁 Item Lifecycle State Machine

### 🎁 Donation Track (Permanent Handoff)
```
AVAILABLE → (request) PENDING → (donor approves) APPROVED
          → (receiver confirms pickup) RECEIVED → (donor confirms delivery) COMPLETED
```

### 🤝 Lending Track (Temporary Share)
```
AVAILABLE → PENDING → APPROVED → (borrower confirms) IN_USE
          → (borrower initiates) PENDING_RETURN → (lender confirms return) RETURNED → AVAILABLE
```

---

## 📡 API Reference

### 🔐 Authentication & Profile

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/auth/register` | Open | Create new account & sync Firebase UID |
| `POST` | `/api/auth/login` | Open | Login with email/password (JWT) |
| `GET` | `/api/auth/me` | 🔒 Token | Retrieve current logged-in profile |
| `PATCH` | `/api/auth/me` | 🔒 Token | Update name, department, or avatar |
| `GET` | `/api/auth/users` | 👑 Admin | Fetch all registered accounts |
| `PATCH` | `/api/auth/users/:id/role` | 👑 Admin | Promote/demote user roles |

### 📦 Resource Items

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `GET` | `/api/items` | Open | Browse & query items (filters, search) |
| `POST` | `/api/items` | 🔒 Token | Post a new resource item |
| `GET` | `/api/items/:id` | Open | Get single item with owner info |
| `PATCH` | `/api/items/:id` | 🔒 Token | Edit item details (AVAILABLE status only) |
| `DELETE` | `/api/items/:id` | 🔒 Token | Delete resource (cascade deletes requests) |
| `PATCH` | `/api/items/:id/deactivate` | 🔒 Token | Temporarily deactivate from search |

### 📬 Transaction Requests

| Method | Endpoint | Auth | Description |
|:---|:---|:---|:---|
| `POST` | `/api/requests` | 🔒 Token | Request a donation/lend item |
| `GET` | `/api/requests/my` | 🔒 Token | View requests initiated by current user |
| `GET` | `/api/requests/incoming` | 🔒 Token | View requests on current user's items |
| `PATCH` | `/api/requests/:id/approve` | 🔒 Token | Donor approves receiver (Donations) |
| `PATCH` | `/api/requests/:id/confirm-pickup` | 🔒 Token | Receiver confirms pickup |
| `PATCH` | `/api/requests/:id/confirm-delivery`| 🔒 Token | Donor confirms delivery (Completed) |
| `PATCH` | `/api/requests/:id/approve-borrower` | 🔒 Token | Lender approves borrower (Lending) |
| `PATCH` | `/api/requests/:id/confirm-receipt` | 🔒 Token | Borrower confirms item in hand (In Use) |
| `PATCH` | `/api/requests/:id/initiate-return` | 🔒 Token | Borrower returns item (Pending Return) |
| `PATCH` | `/api/requests/:id/confirm-return` | 🔒 Token | Lender confirms item returned (Available) |

*`🔒 Token` = Firebase ID Token or JWT required in authorization headers.*
*`👑 Admin` = Admin privilege check required.*

---

## 🎨 UI Design Tokens (Theme System)

Consistent color variables defined in `index.css`:

| Token | HSL / Hex | Purpose |
|:---|:---|:---|
| `--color-mint-light` | `#ccdfd9` | Page backgrounds & primary page headers |
| `--color-green-main` | `#74ab8b` | Branding accent, primary action buttons, links |
| `--color-mint-soft` | `#eef5f2` | Active navigation tabs, soft badge backgrounds |
| `--color-text-dark` | `#1e293b` | Main headings & body copy text |
| `--radius-lg` | `12px` | Card boundaries & popup shapes |

---

## ⚙️ Environment Variables

### Backend (`/backend/.env`)
```ini
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/barakahshare
JWT_SECRET=your_jwt_signature_secret
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

### Frontend (`/frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
VITE_FIREBASE_PROJECT_ID=your-firebase-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-firebase-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
```

---

## 🛠️ Step-by-Step Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/BarakahShare.git
   cd BarakahShare
   ```

2. **Configure environment files:**
   Create `.env` inside `/backend` and `/frontend` using the templates provided above.

3. **Install backend dependencies and run:**
   ```bash
   cd backend
   npm install
   npm run dev
   # Server runs at http://localhost:5000
   ```

4. **Install frontend dependencies and run:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   # App runs at http://localhost:5173
   ```

---

🌿 *Spreading Barakah, one share at a time.*
