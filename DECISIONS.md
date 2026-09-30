# TraceIQ Decisions and Open Questions

## Current working decisions
1. Core backend: modular Node.js/TypeScript monolith.
2. Background processing: separately deployable ingestion and analysis workers.
3. Persistence: PostgreSQL.
4. UI: React + TypeScript.
5. Analysis: Python for statistics/ML; C++ for selected algorithmic components.
6. Local development: Docker Compose where practical.
7. API: versioned REST with OpenAPI.
8. Initial ingestion: manual JUnit XML upload and GitHub webhook path.
9. Explainability: show evidence, provenance, confidence/uncertainty, and limitations.

## Not yet finalized
- Redis + BullMQ versus PostgreSQL-backed job queue
- Identity provider and authentication model
- pybind11 in-process integration versus a separate C++ executable/service
- Local and hosted artifact storage implementation
- Hosting/deployment provider
- Initial supported language/test framework combinations
- Data retention and deletion policy

## Decision rule
For each open item, compare 2–3 realistic options, document tradeoffs (cost, complexity, reliability, security, portability), then record the chosen option and rationale before implementation depends on it.
