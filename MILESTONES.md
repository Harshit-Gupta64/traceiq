# TraceIQ Milestones

0. Repository foundation, tooling, environment validation, Docker Compose, CI checks.
1. Identity, organizations, memberships, tenant isolation, audit basics.
2. Database/API foundation, migrations, repository/run endpoints, OpenAPI.
3. Unified ingestion: JUnit upload, GitHub webhook verification/deduplication, artifact storage, canonical normalization.
4. Job processing: queue, job state machine, retries, idempotency, recovery.
5. Intelligence baseline: failure signatures, similarity, flaky-test reliability estimates, evaluation fixtures, C++ ranking prototype.
6. Dashboard and CLI: run history, failure evidence, analysis status, manual CLI upload.
7. Security and observability: rate limits, headers, redaction, metrics/traces/dashboards.
8. Performance and deployment: defined k6 workloads, stress/soak/recovery tests, deployment and rollback documentation.

Each milestone must be reviewed against its acceptance criteria before starting the next.
