# TraceIQ Requirements

Priorities: **P0** required for the first usable vertical slice; **P1** follow-on; **P2** later/optional.

## P0
- Authenticate users using a selected provider or a documented local-development mode.
- Create organizations and memberships.
- Enforce organization-level authorization for all tenant-owned resources.
- Register repositories.
- Accept at least one documented test report format, initially JUnit XML.
- Validate uploads, enforce size limits, and store raw artifacts separately from relational metadata.
- Receive GitHub webhook events, verify signatures, and deduplicate deliveries.
- Normalize supported inputs into a versioned canonical event schema.
- Queue analysis asynchronously and expose job status.
- Persist run metadata and analysis results.
- Show run history, failure details, and evidence in the dashboard or a documented API.
- Provide structured logs, health checks, and reproducible local setup.
- Include automated tests for normal, malformed, duplicate, unauthorized, and retry cases.

## P1
- CLI for manual upload and analysis.
- GitLab and Jenkins ingestion.
- Flaky-test reliability estimates with uncertainty.
- Similar-failure retrieval and evidence-weighted candidate ranking.
- Historical reliability and failure trend views.
- Operational metrics and dashboards.

## P2
- Additional CI providers and test frameworks.
- More advanced ML only when evaluated against a baseline.
- Deployment autoscaling and larger-scale performance testing.

## Product constraints
- Analysis must not run inside long-lived synchronous API requests.
- Never claim root-cause certainty where evidence is incomplete.
- Preserve raw artifact references and provenance.
- Do not use production user data as training data without an explicit policy and authorization.
- Do not claim 10k-user capacity, compliance, or model accuracy without reproducible evidence.
