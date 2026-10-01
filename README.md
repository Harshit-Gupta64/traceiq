# TraceIQ

> Intelligent CI failure diagnosis and test reliability platform.

TraceIQ analyzes CI test failures, distinguishes flaky tests from real regressions, and retrieves historical failure evidence with transparent uncertainty indicators.

---

## Prerequisites

Ensure you have the following installed on your host machine:

- **Node.js**: `>= 20.0.0` (tested on Node v24)
- **npm**: `>= 10.0.0`
- **Docker Engine**: `>= 24.0.0`
- **Docker Compose**: `>= v2.20.0`

---

## Local Development Architecture

- **Host (Node.js/TypeScript)**: The backend API, test runner, linting, and tooling run directly on the host machine for rapid development, type-checking, and debugging.
- **Docker Compose (PostgreSQL 16)**: Backing database services are containerized to ensure reproducible local development without polluting host installations.
  - *Note*: Queue/cache selection (e.g., Redis vs PostgreSQL queue) is currently an open architectural decision (see `DECISIONS.md`) and is not yet configured.

---

## Getting Started (Clean Clone Setup)

Follow these exact steps to set up the project locally:

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/Harshit-Gupta64/traceiq.git
cd traceiq
npm install
```

### 2. Configure Environment

Copy the example environment template to `.env`:

```bash
# On Linux/macOS
cp .env.example .env

# On Windows PowerShell
Copy-Item .env.example .env
```

The default values in `.env.example` point to the local Dockerized PostgreSQL instance and safe placeholder values.
*Note*: If port `5432` is already in use by a local host service (e.g. an existing local PostgreSQL installation), set `POSTGRES_PORT=5433` and update the port in `DATABASE_URL` in `.env`.

### 3. Start Local Infrastructure

Start PostgreSQL 16 with a persistent development volume and health check:

```bash
npm run docker:up
# Or directly: docker compose up -d
```

Verify that PostgreSQL reaches a `healthy` state:

```bash
npm run docker:ps
# Or: docker compose ps
```

### 4. Apply Database Migrations

Apply pending migrations to the database:

```bash
# Apply pending migrations
npm run migrate:up

# Check migration status
npm run migrate:status

# Roll back the most recent migration (if needed)
npm run migrate:down
```

### 5. Start the API Server

Start the API with hot reloading during development:

```bash
npm run dev
```

Or build and run for production:

```bash
npm run build
npm start
```

---

## API Endpoints

The API is served at `http://localhost:3000` by default.

| Endpoint | Method | Description | Success Response | Unavailable Response |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/health` | `GET` | Process liveness probe | `200 OK`<br>`{ "status": "ok", "timestamp": "...", "uptime": ... }` | N/A |
| `/api/v1/ready` | `GET` | Database readiness probe | `200 OK`<br>`{ "status": "ready", "database": "connected" }` | `503 Service Unavailable`<br>`{ "status": "not_ready", "database": "disconnected" }` |

*Security guarantee: Error responses never leak stack traces, internal connection strings, credentials, or host details.*

---

## Verification & Quality Checks

Run the foundational verification suite:

```bash
# Check code formatting (Prettier)
npm run format:check

# Format files automatically
npm run format

# Run ESLint checks
npm run lint

# Run TypeScript strict type-check
npm run typecheck

# Run automated tests (Vitest)
npm test
```

### Testing Tiers

- **Unit Tests**: Test pure logic, schema validation, route contracts, error masking, and mocked database health without requiring external services.
- **Integration Tests**: Execute live queries, connection pooling, and migrations against the running PostgreSQL container. If PostgreSQL is not running, integration tests skip gracefully.

### Stopping Infrastructure

To stop the PostgreSQL container:

```bash
npm run docker:down
# Or: docker compose down
```

To stop containers and remove persistent database volumes:

```bash
docker compose down -v
```

---

## Project Structure

```
├── .github/workflows/ci.yml # GitHub Actions CI workflow
├── migrations/              # Reversible SQL migrations (*.up.sql, *.down.sql)
│   ├── 001_foundation.up.sql
│   └── 001_foundation.down.sql
├── src/
│   ├── api/                 # Fastify API application, error handling, and routes
│   │   ├── routes/          # Health and readiness endpoints
│   │   └── app.ts           # Fastify application factory
│   ├── config/              # Zod environment schema and validation
│   ├── db/                  # PostgreSQL pool and transactional SQL migrator
│   │   ├── pool.ts          # Connection pool and health checks
│   │   ├── migrator.ts      # Transactional migration engine
│   │   └── migrate-cli.ts   # Migration CLI runner
│   ├── server.ts            # HTTP server startup & graceful shutdown
│   └── index.ts             # Foundation entrypoint
├── tests/
│   ├── api/                 # Unit tests for API routes
│   ├── config/              # Unit tests for environment configuration
│   ├── db/                  # Unit tests for database utilities
│   └── integration/         # Integration tests against live PostgreSQL
├── test-fixtures/           # Synthetic JUnit and log test fixtures
├── evidence/                # Milestone verification logs and artifacts
├── docker-compose.yml       # Local PostgreSQL 16 container definition
├── .env.example             # Safe environment variable template
├── tsconfig.json            # Strict TypeScript configuration
├── eslint.config.mjs        # ESLint 9 configuration
└── vitest.config.ts         # Vitest test configuration
```

---

## Core Documentation

- [PROJECT_BRIEF.md](file:///c:/Projects/TraceIQ_Handoff_Kit/PROJECT_BRIEF.md): Product vision, constraints, and scope.
- [REQUIREMENTS.md](file:///c:/Projects/TraceIQ_Handoff_Kit/REQUIREMENTS.md): Prioritized functional requirements (P0/P1/P2).
- [ARCHITECTURE.md](file:///c:/Projects/TraceIQ_Handoff_Kit/ARCHITECTURE.md): Architectural direction and components.
- [DECISIONS.md](file:///c:/Projects/TraceIQ_Handoff_Kit/DECISIONS.md): Architecture decisions and open items.
- [SECURITY_REQUIREMENTS.md](file:///c:/Projects/TraceIQ_Handoff_Kit/SECURITY_REQUIREMENTS.md): Baseline security and data policies.
- [TEST_STRATEGY.md](file:///c:/Projects/TraceIQ_Handoff_Kit/TEST_STRATEGY.md): Testing tiers and evidence capture.
- [MILESTONES.md](file:///c:/Projects/TraceIQ_Handoff_Kit/MILESTONES.md): Staged implementation roadmap.
- [ACCEPTANCE_CRITERIA.md](file:///c:/Projects/TraceIQ_Handoff_Kit/ACCEPTANCE_CRITERIA.md): Milestone acceptance criteria.
