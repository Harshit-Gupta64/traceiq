# Initial Acceptance Criteria

## Milestone 0: Repository and local development foundation
- Repository has documented structure and setup.
- Environment variables are validated and `.env.example` contains placeholders only.
- Formatting, linting, type-check, and test commands are documented.
- Docker Compose starts required local dependencies or clearly documents what is not containerized.
- A clean clone can follow the README to reach a verified healthy state.

## Milestone 1: Identity and tenant boundary
- User can authenticate in the selected development/auth mode.
- Organization and membership records persist.
- Every tenant-owned endpoint checks membership/role.
- Automated tests prove cross-tenant reads and writes are denied.
- Authorization failures return consistent errors without leaking resource details.

## Milestone 2: Report ingestion vertical slice
- Supported JUnit XML fixture can be uploaded within configured limits.
- Invalid and oversized files are rejected safely.
- Raw artifact is stored separately from normalized metadata.
- Normalized events match expected fixture output.
- Upload/run status is queryable and errors are observable.

## Milestone 3: Async analysis job
- Upload creates a durable, traceable job.
- Job states and retry limits are documented.
- Duplicate requests/events do not create duplicate completed results.
- Worker failure is visible and does not leave jobs permanently stuck.
- Analysis result links back to source run/artifact and shows evidence.

## General
- Relevant tests and build checks are run and reported.
- No secrets are committed.
- No unsupported scalability, accuracy, or compliance claims are made.
