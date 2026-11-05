# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Frontend

React app (Vite, React Router) in `frontend/`. It talks to the API through `frontend/src/api.js`.

### Setup

```bash
cd frontend
npm install
cp .env.example .env     # Windows PowerShell: copy .env.example .env
npm run dev
```

Open http://localhost:5173. Use `localhost`, not `127.0.0.1`, because the API's `CORS_ORIGIN` allows only the exact origin listed in its `.env`.

| Variable | Meaning |
| --- | --- |
| `VITE_API_URL` | Base URL of the API (default `http://localhost:3000`) |

Restart `npm run dev` after changing `.env`. Variables starting with `VITE_` are embedded in the browser code, so never put secrets in them.

### Running everything

1. Start PostgreSQL.
2. Backend: `npm run dev` in the repo root (API on port 3000).
3. Frontend: `npm run dev` in `frontend/` (app on port 5173).

### Pages

- `/`: ticket list, status filter (stored in the URL as `?status=`), and the create-ticket form
- `/tickets/:id`: ticket detail, status and priority controls, delete, and comments
