# 🚀 Project LinkHub

[![codecov](https://codecov.io/gh/Saliim17/linkhub-project/graph/badge.svg?token=239KHSAGAO)](https://codecov.io/gh/Saliim17/linkhub-project)

A Linktree clone / 'link-in-bio' profile manager built as a Full-Stack 100% TypeScript learning project.

This repository is a **Full-Stack TypeScript Monorepo** containing:

1.  **`/linkhub-api`**: A robust backend API **(Fastify, Prisma, Zod)**
2.  **`/linkhub-app`**: A React admin dashboard **(React, Vite, Vitest)**

---

## ✨ Core Features

* **Backend (API):**
    * Complete User Authentication (Register & Login) with JWT.
    * Protected CRUD (Create, Read, Update, Delete) endpoints for Links.
    * Publicly accessible profile route (`/:username`) to display links.
* **Frontend (App):**
    * Token-based authentication flow (Login, Register, Logout).
    * Protected routing to secure the dashboard.
    * API data fetching with `axios` to display user links.
* **DevOps:**
    * Full CI/CD pipeline with GitHub Actions.
    * Automated linting, testing, and building for the frontend.

---

## 🛠️ Tech Stack

### Backend (`/linkhub-api`)

* **Framework:** Fastify
* **Language:** TypeScript (Strict)
* **Database:** PostgreSQL (managed by Prisma)
* **ORM:** Prisma
* **Authentication:** JWT (JSON Web Tokens)
* **Validation:** Zod
* **Code Quality:** ESLint, Prettier

### Frontend (`/linkhub-app`)

* **Framework:** React
* **Language:** TypeScript
* **Bundler:** Vite
* **Routing:** React Router DOM
* **Testing:** Vitest & React Testing Library
* **Data Fetching:** Axios
* **Code Quality:** ESLint, Prettier

---

## 🏁 Getting Started

To run this project, you will need **three** separate terminals.

### 1. Start the Backend (API)

```bash
# Terminal 1 (Database)
cd linkhub-api
npx prisma dev

# Terminal 2 (API Server)
cd linkhub-api
npm run dev
```
The API will be running at http://localhost:3000

### 2. Start the Frontend (App)
```
# Terminal 3 (React App)
cd linkhub-app
npm run dev
```
The React app will be running at http://localhost:5173
