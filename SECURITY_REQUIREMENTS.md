# TraceIQ Security Requirements

## Baseline
- Use HTTPS in deployed environments.
- Keep secrets out of source control, logs, screenshots, and prompts.
- Validate and constrain uploads (type, size, parsing time, and storage location).
- Verify webhook signatures and deduplicate provider deliveries.
- Use parameterized SQL and validated inputs.
- Apply authentication and organization-level authorization on every protected operation.
- Use least-privilege service/database credentials.
- Configure CORS narrowly and use appropriate security headers.
- Apply rate limits by route and identity/tenant; trust forwarded IP headers only from known proxies.
- Redact tokens, secrets, and sensitive log fragments.
- Use timeouts for outbound calls and bounded retries with backoff for safe/idempotent operations.
- Record security-relevant actions in audit logs where appropriate.
- Scan dependencies and container images in CI when tooling is available.

## Sensitive data
CI logs may accidentally contain credentials or personal data. Avoid logging raw artifact contents by default. Define retention and deletion behavior before production use. Do not claim HIPAA compliance; do not solicit protected health information.

## Security tests
Include cross-tenant access denial, invalid/forged webhook signatures, duplicate webhook delivery, oversized upload rejection, malformed XML handling, unauthorized API access, and secret-redaction checks.
