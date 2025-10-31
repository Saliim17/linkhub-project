# 🚀 Project LinkHub

Un clon de Linktree / gestor de perfiles 'link-in-bio' construido como un proyecto de aprendizaje Full-Stack 100% en TypeScript.

Este repositorio es un **monorepo** que contiene:

1.  **`/linkhub-api`**: Un backend API robusto.
2.  **`/linkhub-app`**: Un frontend de administración.

---

## 🛠️ Stack Tecnológico

### Backend (`/linkhub-api`)

* **Framework:** Fastify
* **Lenguaje:** TypeScript (Strict)
* **Base de Datos:** PostgreSQL
* **ORM:** Prisma
* **Autenticación:** JWT (JSON Web Tokens)
* **Validación:** Zod
* **Calidad de Código:** ESLint, Prettier

### Frontend (`/linkhub-app`)

* **Framework:** React
* **Lenguaje:** TypeScript
* **Bundler:** Vite
* **Calidad de Código:** ESLint, Prettier

---

## 🏁 Cómo Empezar

### 1. Iniciar el Backend (API)

```bash
# Terminal 1 (Base de Datos)
cd linkhub-api
npx prisma dev

# Terminal 2 (Servidor API)
cd linkhub-api
npm run dev

# Terminal 3 (React App)
cd linkhub-app
npm run dev