# EXPOSER — Corruption Reporting Portal
> Expose Corruption, Protect Democracy

A secure, anonymous platform where citizens report corruption, provide evidence, and track accountability.  
Built with **React 18 + Firebase (Auth, Firestore, Storage)**.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start

# Opens at http://localhost:3000
```

---

## 🔥 Firebase Setup (Required before login works)

Your Firebase config is already set in `src/firebase/config.js`.  
Just complete these steps in your Firebase Console:

### Step 1 — Enable Authentication
1. Firebase Console → **Authentication** → Get started
2. Enable **Email/Password** provider

### Step 2 — Enable Firestore
1. Firebase Console → **Firestore Database** → Create database
2. Start in **test mode** (update rules after setup)

### Step 3 — Enable Storage
1. Firebase Console → **Storage** → Get started
2. Start in test mode

### Step 4 — Deploy Firestore Rules
1. Firebase Console → Firestore → **Rules** tab
2. Paste the contents of `firestore.rules` → **Publish**

### Step 5 — Create Admin Account
1. Firebase Console → Authentication → **Add user**
   - Email: `admin@exposer.com`
   - Password: choose a strong password
2. Copy the **UID** from the Users list
3. Firebase Console → Firestore → **users** collection → Add document:
   - Document ID: (auto)
   - Fields:
     ```
     uid:      "PASTE_UID_HERE"
     name:     "Admin"
     email:    "admin@exposer.com"
     role:     "admin"
     isActive: true
     ```

### Step 6 — Create Investigator Account (optional)
Repeat Step 5 with `role: "investigator"`.

---

## 📁 Project Structure

```
exposer-app/
├── public/
│   └── index.html
├── src/
│   ├── firebase/
│   │   ├── config.js       ← Your Firebase config (already set)
│   │   └── services.js     ← All Firestore/Auth/Storage operations
│   ├── context/
│   │   └── AuthContext.js  ← Auth state management
│   ├── components/
│   │   ├── Navbar.js       ← Top navigation (EXPOSER branding)
│   │   └── ProtectedRoute.js
│   ├── pages/
│   │   ├── Home.js         ← Hero + features
│   │   ├── ReportCase.js   ← Report submission form
│   │   ├── TrackCase.js    ← Track by ID
│   │   ├── Dashboard.js    ← Admin dashboard (real-time)
│   │   ├── ReportDetail.js ← Single report view + notes
│   │   ├── Login.js        ← Admin login page
│   │   └── About.js        ← About page
│   ├── App.js              ← Routes + layout
│   ├── index.js            ← Entry point
│   └── index.css           ← Global styles (blue/pink/white theme)
├── firestore.rules         ← Paste in Firebase Console
└── package.json
```

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| Blue | `#0ea5e9` | Primary, logo, links |
| Pink | `#ec4899` | Accents, Track button |
| Purple | `#818cf8` | Gradients, investigating badge |
| White | `#ffffff` | Background |
| Gray | `#f9fafb` | Subtle backgrounds |

**Gradient brand:** `linear-gradient(135deg, #0ea5e9, #818cf8, #ec4899)`

---

## 🗄️ Firestore Collections

```
reports/
  trackId         EXPS-XXXXXXXXXX-XXXXXX
  title           string
  description     string
  category        string
  severity        low | medium | high | critical
  status          pending | reviewing | investigating | escalated | resolved | dismissed
  location        string
  incidentDate    string
  isAnonymous     boolean
  reporterEmail   string | null
  evidence        [{ url, name, size, type }]
  assignedTo      string | null
  createdAt       timestamp
  updatedAt       timestamp

comments/
  reportId        string (ref to reports)
  userId          string
  userName        string
  message         string
  isInternal      boolean
  createdAt       timestamp

users/
  uid             string (Firebase Auth UID)
  name            string
  email           string
  role            admin | investigator
  isActive        boolean
  createdAt       timestamp

auditLog/
  action          REPORT_CREATED | STATUS_CHANGED | ...
  entityType      report | user
  entityId        string
  details         object
  updatedBy       string
  createdAt       timestamp
```

---

## 🔐 User Roles

| Role | Can Submit | Can View Reports | Can Update Status | Can Manage Users |
|---|---|---|---|---|
| Public | ✅ | ❌ | ❌ | ❌ |
| Investigator | ✅ | ✅ | ✅ | ❌ |
| Admin | ✅ | ✅ | ✅ | ✅ |

---

## 🌐 Deploy (Production)

```bash
npm run build

# Option A — Firebase Hosting
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy

# Option B — Vercel
npx vercel deploy
```

---

## 📌 Pages & Routes

| Route | Page | Access |
|---|---|---|
| `/` | Home (Hero + Features) | Public |
| `/report` | Report Submission Form | Public |
| `/track` | Track by ID | Public |
| `/about` | About EXPOSER | Public |
| `/login` | Admin Login | Public |
| `/dashboard` | Admin Dashboard (real-time) | Admin / Investigator |
| `/report/:id` | Report Detail + Notes | Admin / Investigator |

---

*Built for college study — demonstrates Firebase + React full-stack development.*
