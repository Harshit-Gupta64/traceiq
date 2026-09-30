# TraceIQ Data Plan

## Initial development
Use clearly labeled synthetic fixtures to establish parser and pipeline behavior. Include passing, failing, skipped, timeout, assertion, malformed, duplicate, and flaky-history cases.

## Public datasets
Candidate sources to investigate before use:
- IDoFT: https://github.com/TestingResearchIllinois/idoft
- TSE22 Flaky Tests Across Programming Languages: https://github.com/Test-Flaky/TSE22
- TUM Flaky Tests in CI: https://github.com/tum-i4/flaky-tests-in-ci
- Google CI test-suite dataset: https://github.com/elbaum/CI-Datasets
- Defects4J: https://github.com/rjust/defects4j

Before downloading or redistributing any dataset, verify its current license, terms, size, provenance, and whether it contains raw logs, labels, execution histories, or only issue metadata. Record the dataset version and preprocessing steps. Avoid assuming that a dataset supports root-cause accuracy evaluation unless it contains suitable ground-truth labels.
