# Expected fixture behavior

These are synthetic fixtures for development, not production data.

- `junit/passing-and-failing.xml`: parser should produce three test cases: one passed, one failed with an assertion error, and one skipped.
- `junit/malformed.xml`: parser should reject safely with a structured validation error; it must not crash the worker.
- `logs/timeout-failure.log`: signature normalization should recognize a timeout-like failure while preserving a reference to the original artifact.
