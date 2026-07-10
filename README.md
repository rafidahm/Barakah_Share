# BarakahShare — University Resource Sharing Platform

> A MERN-stack platform where IIUC students donate, lend, borrow, and request resources — spreading barakah one share at a time.

---

## 📁 Monorepo Structure

```
g:\BaraqahShare\
├── frontend/          ← React + Vite + Tailwind CSS (Phase 1 ✅)
│   ├── src/
│   │   ├── assets/         ← Hero, login, bookshelf images
│   │   ├── components/     ← Reusable UI components
│   │   │   ├── common/     ← Navbar, Footer, Badge, Modal, Spinner, ConfirmDialog
│   │   │   ├── charts/     ← CategoryPieChart, DonationTrendChart, BorrowingTrendChart
│   │   │   ├── dashboard/  ← DashboardSidebar
│   │   │   ├── home/       ← HeroSection, StatsCounter, FeaturedItems, HowItWorks, Testimonials
│   │   │   ├── items/      ← ItemCard, ItemGrid, ItemFilters, ItemForm
│   │   │   └── reviews/    ← StarRating, ReviewCard, ReviewForm
│   │   ├── context/        ← AuthContext, AppContext (mock data layer)
│   │   ├── data/           ← mockData.js (replaced by API in Phase 2)
│   │   ├── hooks/          ← useToast.jsx
│   │   ├── pages/
│   │   │   ├── auth/       ← Login, Register
│   │   │   ├── admin/      ← AdminDashboard (5 tabs)
│   │   │   ├── public/     ← Home, Items, ItemDetail, About, Contact, NotFound
│   │   │   └── user/       ← UserDashboard (4 tabs)
│   │   ├── routes/         ← AppRouter, PrivateRoute, AdminRoute
│   │   └── utils/          ← helpers.js
│   └── package.json
│
└── backend/           ← Node.js + Express + MongoDB (Phase 2 ✅)
    ├── config/         ← db.js (Mongoose), firebase.js (Admin SDK)
    ├── controllers/    ← authController, itemController, requestController, reviewController
    ├── middleware/     ← verifyToken (JWT + Firebase), verifyAdmin
    ├── models/         ← User, Item, Request, Review (Mongoose schemas)
    ├── routes/         ← authRoutes, itemRoutes, requestRoutes, reviewRoutes
    ├── server.js       ← Express app entry point
    └── package.json
```

---

## 🎨 Design System

| Token | Color | Usage |
|---|---|---|
| `--color-mint-light` | `#ccdfd9` | Backgrounds, hero gradient |
| `--color-teal-mid` | `#90b4b0` | Secondary accents |
| `--color-green-main` | `#74ab8b` | Primary buttons, CTAs |
| White | `#ffffff` | Cards, forms |

---

## 🚀 Getting Started

### Frontend (Phase 1)
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5174
```

### Backend (Phase 2)
```bash
cd backend
cp .env.example .env
# Fill in: MONGO_URI, JWT_SECRET, FIREBASE_* credentials
npm install
npm run dev
# → http://localhost:5000
```

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Register new user |
| POST | `/api/auth/login` | — | Login with email/password |
| GET | `/api/auth/me` | 🔒 | Get current user |
| PATCH | `/api/auth/me` | 🔒 | Update profile |
| GET | `/api/auth/users` | 👑 | Admin: all users |
| PATCH | `/api/auth/users/:id/role` | 👑 | Admin: change role |
| GET | `/api/items` | — | Browse/filter items |
| POST | `/api/items` | 🔒 | Post new item |
| GET | `/api/items/:id` | — | Item detail |
| PATCH | `/api/items/:id` | 🔒 | Update item |
| DELETE | `/api/items/:id` | 🔒 | Delete item |
| PATCH | `/api/items/:id/deactivate` | 🔒 | Deactivate item |
| POST | `/api/requests` | 🔒 | Submit request |
| GET | `/api/requests/my` | 🔒 | My requests |
| PATCH | `/api/requests/:id/approve` | 🔒 | Donor approves |
| PATCH | `/api/requests/:id/confirm-pickup` | 🔒 | Receiver confirms |
| PATCH | `/api/requests/:id/confirm-delivery` | 🔒 | Donor confirms delivery |
| PATCH | `/api/requests/:id/approve-borrower` | 🔒 | Lender approves |
| PATCH | `/api/requests/:id/confirm-receipt` | 🔒 | Borrower confirms receipt |
| PATCH | `/api/requests/:id/initiate-return` | 🔒 | Borrower returns |
| PATCH | `/api/requests/:id/confirm-return` | 🔒 | Lender confirms return |
| POST | `/api/reviews` | 🔒 | Add review |
| GET | `/api/reviews/item/:id` | — | Item reviews |
| GET | `/api/analytics` | 👑 | Admin analytics |

🔒 = JWT/Firebase token required | 👑 = Admin role required

---

## 🔁 Item Lifecycle

### Donation Track
```
AVAILABLE → (request) PENDING → (donor approves) APPROVED
          → (receiver confirms pickup) RECEIVED → (donor confirms) COMPLETED
```

### Lending Track
```
AVAILABLE → PENDING → APPROVED → (borrower confirms) IN_USE
          → (borrower initiates) PENDING_RETURN → (lender confirms) RETURNED → AVAILABLE
```

---

## 🔮 Phase 2 TODO — Frontend Integration

When the backend is running, update the frontend by:

1. **Create `frontend/src/services/api.js`** with Axios instance:
   ```js
   const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });
   api.interceptors.request.use(cfg => {
     const token = localStorage.getItem('token');
     if (token) cfg.headers.Authorization = `Bearer ${token}`;
     return cfg;
   });
   ```

2. **Replace mock functions in `AppContext.jsx`** with API calls, e.g.:
   ```js
   // Old: return mockItems.filter(...)
   // New: const res = await api.get('/items', { params: filters });
   ```

3. **Update `AuthContext.jsx`** to call `/api/auth/login` and store the JWT token.

---

Built with ❤️ for the IIUC community — spreading barakah through sharing.
