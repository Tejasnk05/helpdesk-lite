# Helpdesk Lite: Backend

A small ticketing API for learning. Node + Express + TypeScript + PostgreSQL + Knex + Zod.
Backend only: no auth, comments, or frontend yet.

## Prerequisites

- Node.js 20+ (`node -v`)
- A running PostgreSQL 14+ server and an empty database (e.g. `helpdesk_db`)
- Optional: DBeaver to browse the data, Postman or curl to call the API

## Setup

```bash
npm install
cp .env.example .env     # Windows PowerShell: copy .env.example .env
```

Edit `.env` with your own values:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=helpdesk_db
DB_SSL=false
```

`.env` is git-ignored. `.env.example` is the committed template. Set `DB_SSL=true` only for hosted databases that require SSL.

## Run

```bash
npm run migrate     # creates the tickets table
npm run dev         # starts the API on http://localhost:3000
```

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start with auto-reload |
| `npm run build` / `npm start` | Compile to `dist/` / run the compiled build |
| `npm run typecheck` | Type-check without emitting files |
| `npm run migrate` | Apply pending migrations |
| `npm run migrate:rollback` | Undo the last batch |
| `npm run migrate:status` | Show applied migrations |
| `npm run migrate:make -- name` | Create a new migration file |

## Structure and layers

```
src/
├── server.ts          starts the server
├── app.ts             Express app: middleware + routes
├── config/env.ts      reads and validates .env
├── routes/            URL + method -> controller
├── controllers/       validate input, send the HTTP response
├── services/          business logic + Knex queries
├── db/                knexfile, shared connection, migrations
├── schemas/           Zod validation schemas
├── middleware/        error handling (400 / 404 / 500)
├── errors/            HttpError, NotFoundError
└── types/             shared TypeScript types
```

routes → controllers → services → database

- **Routes:** map an HTTP method and URL to a controller function.
- **Controllers:** validate input, call a service, choose the status code.
- **Services:** hold the logic and run the database queries; know nothing about HTTP.
- **Database:** PostgreSQL, schema managed by Knex migrations.

## Tickets table

| Column | Type | Notes |
| --- | --- | --- |
| id | integer | primary key, auto-increment |
| title | varchar(200) | required |
| description | text | optional |
| priority | low / medium / high | default medium |
| status | open / in_progress / resolved | default open |
| created_at | timestamptz | set automatically |
| updated_at | timestamptz | refreshed on every PATCH |

## API (curl examples)

Base URL: `http://localhost:3000`

On Windows PowerShell use `curl.exe` (plain `curl` is a different command) and escape the quotes in the JSON: `-d '{\"title\": \"x\"}'`.

**Create: `POST /tickets` → 201** (only `title` is required)

```bash
curl -i -X POST http://localhost:3000/tickets \
  -H "Content-Type: application/json" \
  -d '{"title": "Printer is on fire", "description": "3rd floor", "priority": "high"}'
```

**List: `GET /tickets` → 200** (newest first; optional `?status=open|in_progress|resolved`)

```bash
curl -i http://localhost:3000/tickets
curl -i "http://localhost:3000/tickets?status=open"
```

**Get one: `GET /tickets/:id` → 200**

```bash
curl -i http://localhost:3000/tickets/1
```

**Update: `PATCH /tickets/:id` → 200** (send only the fields to change; `"description": null` clears it)

```bash
curl -i -X PATCH http://localhost:3000/tickets/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "in_progress"}'
```

**Delete: `DELETE /tickets/:id` → 204** (no body)

```bash
curl -i -X DELETE http://localhost:3000/tickets/1
```

### Errors

Errors are JSON: `{ "error": "..." }`, and validation errors also include a `details` array.

| Situation | Status |
| --- | --- |
| Invalid body, query, or id | 400 |
| Ticket or route not found | 404 |
| Unexpected server error | 500 |

```bash
curl -i -X POST http://localhost:3000/tickets -H "Content-Type: application/json" -d '{}'          # 400
curl -i -X POST http://localhost:3000/tickets -H "Content-Type: application/json" -d '{"title":"x","priority":"urgent"}'   # 400
curl -i "http://localhost:3000/tickets?status=bogus"                                                # 400
curl -i http://localhost:3000/tickets/abc                                                           # 400
curl -i http://localhost:3000/tickets/99999                                                         # 404
```

## Troubleshooting

- **Invalid environment configuration:** `.env` is missing or incomplete.
- **ECONNREFUSED:** Postgres isn't running, or host/port in `.env` is wrong.
- **password authentication failed:** `DB_USER` / `DB_PASSWORD` don't match your Postgres login.
- **Postman returns "title is required" for a valid body:** set the body type to JSON, not Text.