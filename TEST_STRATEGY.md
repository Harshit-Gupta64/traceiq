# TraceIQ Test Strategy

## Test layers
- Unit: parsers, validators, normalization, reliability calculations, signature normalization.
- Contract: API request/response schemas and canonical event versioning.
- Integration: PostgreSQL persistence, queue behavior, artifact storage, webhook processing.
- End-to-end: upload → normalization → job → result retrieval.
- Security: tenant isolation, webhook signatures, upload limits, injection-safe queries, secret redaction.
- Performance: API workload, ingestion bursts, queue backlog, analysis throughput, database contention, soak/recovery.

## Required test scenarios
- Valid report with passing and failing tests
- Malformed or truncated report
- Unsupported report version/format
- Empty report and missing optional fields
- Oversized upload
- Duplicate webhook event
- Invalid webhook signature
- Worker retry and terminal failure
- Reprocessing without duplicate results
- User from organization A attempts to access organization B data
- Large run history pagination
- Analysis result includes provenance/evidence and does not imply certainty without labels

## Evidence
For each milestone, save exact commands, test output, environment details, and relevant screenshots under `evidence/`. Record skipped tests and reasons.
