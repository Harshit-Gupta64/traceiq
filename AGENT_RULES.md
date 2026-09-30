# TraceIQ Agent Rules

## Before changing code
- Read README.md, PROJECT_BRIEF.md, REQUIREMENTS.md, ARCHITECTURE.md, DECISIONS.md, and the active milestone.
- Inspect the existing repository before proposing changes.
- Do not replace established technologies or architectural decisions without explaining the reason and requesting approval.
- Identify ambiguity before implementing behavior that depends on it.

## Implementation
- Work only on the requested milestone and its dependencies.
- Prefer small, modular, maintainable changes.
- Do not add unrelated features or speculative abstractions.
- Never hardcode secrets, credentials, environment-specific URLs, or user data.
- Validate external input and use parameterized SQL.
- Enforce organization-level authorization for every tenant-owned resource.
- Keep expensive analysis out of synchronous API handlers.
- Make ingestion and job processing idempotent where applicable.
- Add tests for new behavior and regression tests for bug fixes.

## Verification
- Run relevant formatting, linting, type checks, tests, and builds.
- Do not claim a test passed unless it was actually executed.
- Report commands, results, failures, and skipped checks.
- Do not weaken tests or suppress errors merely to obtain a passing result.
- Do not claim performance, scalability, security, accuracy, or compliance without evidence.

## End-of-task report
1. Summary of changes
2. Files created or modified
3. Commands executed and results
4. Manual verification steps
5. Known limitations and risks
6. Suggested next task

## Scope control
- Stop after the requested milestone.
- Do not start the next milestone without approval.
- If blocked, explain the blocker and give the smallest practical options.
