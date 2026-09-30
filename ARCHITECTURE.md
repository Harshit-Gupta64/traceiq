# TraceIQ Architecture (Working Direction)

## Shape
Use a modular TypeScript monolith for core API functionality, with independently deployable ingestion and analysis workers. Avoid premature microservices.

## Proposed components
- Web: React + TypeScript
- API: Node.js + TypeScript, versioned REST API and OpenAPI
- Database: PostgreSQL
- Queue/cache: Redis + BullMQ are candidates; final choice pending operational and durability review
- Ingestion: validate provider events and uploaded artifacts; normalize to canonical contracts
- Analysis: Python statistical/ML modules and a C++ algorithmic engine
- Local environment: Docker Compose
- Observability: structured logs, OpenTelemetry, Prometheus/Grafana; add tracing/log aggregation as needed
- Artifact storage: local volume in development; object storage in deployment

## Request flow
Client/provider → reverse proxy/TLS → stateless API → database + job queue → workers → results/artifact references → API/dashboard.

Expensive parsing and analysis happen asynchronously. API requests validate, persist/queue work, and return a job/run identifier.

## Scaling principles
- Keep API instances stateless and horizontally scalable.
- Scale worker pools separately, with bounded concurrency.
- Bound database connections and account for total connections across replicas.
- Store large raw logs/artifacts outside relational database rows.
- Use indexes, query plans, pagination, and caching based on measurements.
- Define workload profiles before load testing. 10k connected sessions, 10k active requesters, and analysis throughput are different workloads.

## Open decisions
- Identity provider and local auth approach
- Queue implementation and durability/recovery behavior
- C++/Python integration boundary
- Artifact storage provider
- Initial deployment target
- Supported JUnit dialects and upload limits
