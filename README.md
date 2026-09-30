# TraceIQ Handoff Kit

Starter project-control pack for TraceIQ. Review and customize these documents before asking an implementation agent to change code.

## Contents
- `PROJECT_BRIEF.md`: product purpose, users, scope, constraints
- `REQUIREMENTS.md`: prioritized product requirements
- `ARCHITECTURE.md`: current architecture direction and open decisions
- `DECISIONS.md`: decisions made and decisions still pending
- `AGENT_RULES.md`: operating rules for the coding agent
- `SECURITY_REQUIREMENTS.md`: baseline security requirements
- `TEST_STRATEGY.md`: how to test and collect evidence
- `ACCEPTANCE_CRITERIA.md`: initial milestone acceptance criteria
- `MILESTONES.md`: staged implementation roadmap
- `DATA_SOURCES.md`: data plan and dataset review checklist
- `.env.example`: placeholders only; never put real secrets here
- `test-fixtures/`: synthetic sample reports and expected normalized output
- `evidence/`: place screenshots, test results, and benchmark reports here

## First steps
1. Read and edit the project brief and requirements.
2. Confirm pending technology decisions before implementation.
3. Add real secrets only to local environment configuration or a secret manager.
4. Commit this kit to your Git repository.
5. Ask the agent to inspect the repository and report a plan before it edits files.
