# CareerPulse — MERN Stack Job Application Tracker (Backend API)

Production-ready backend API service for **CareerPulse Job Application Tracker**, engineered with **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**.

---

## 🚀 Key Architectural Features
- **MVC Architecture**: Decoupled models, controllers, and route handlers.
- **JWT Authentication**: Secure Bearer token authorization protecting all application routes.
- **Password Security**: Automatic salt generation and bcrypt hashing before saving to MongoDB.
- **CRUD Operations**: Complete application lifecycle management (Wishlist, Applied, Interviewing, Offered, Rejected).
- **Search & Filter Heuristics**: Multi-field regex search across companies and roles with status query filters.
- **Analytics Aggregation**: MongoDB aggregation pipeline computing real-time pipeline conversion statistics.
- **Safety Guards**: Custom 404, global asynchronous error handler, and MongoDB connection fault tolerance.

---

## 🛠️ API Endpoint Reference

### Authentication Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new developer account | Public |
| `POST` | `/api/auth/login` | Authenticate user and receive JWT | Public |
| `GET` | `/api/auth/me` | Retrieve authenticated profile | Protected |

### Job Application Routes (`/api/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/jobs` | Retrieve all applications (supports `?status=`, `?search=`, `?sort=`) | Protected |
| `GET` | `/api/jobs/stats` | Aggregate dashboard KPI metrics | Protected |
| `POST` | `/api/jobs` | Create a new job application | Protected |
| `PATCH` | `/api/jobs/:id` | Update an existing application (e.g. status) | Protected |
| `DELETE` | `/api/jobs/:id` | Remove a job application | Protected |

---

## 💻 Quick Start & Running Locally

### 1. Install Dependencies
```bash
cd job-tracker-mern
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
# or
npm start
```
The server will boot on `http://localhost:5000`. Test health status at `http://localhost:5000/health`.
