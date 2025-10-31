# 🚀 Project LinkHub

A Linktree clone / 'link-in-bio' profile manager built as a Full-Stack 100% TypeScript learning project.

This repository is a **monorepo** containing:

1.  **`/linkhub-api`**: A robust backend API.
2.  **`/linkhub-app`**: An admin frontend.

---

## 🛠️ Tech Stack

### Backend (`/linkhub-api`)

* **Framework:** Fastify
* **Language:** TypeScript (Strict)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** JWT (JSON Web Tokens)
* **Validation:** Zod
* **Code Quality:** ESLint, Prettier

### Frontend (`/linkhub-app`)

* **Framework:** React
* **Language:** TypeScript
* **Bundler:** Vite
* **Code Quality:** ESLint, Prettier

---

## 🏁 Getting Started

### 1. Start the Backend (API)

```bash
# Terminal 1 (Database)
cd linkhub-api
npx prisma dev

# Terminal 2 (API Server)
cd linkhub-api
npm run dev
