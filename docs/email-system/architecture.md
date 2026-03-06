# Architecture

The system is built on Domain-Driven Design (DDD) principles. The architecture guarantees that dependencies point inwards towards the domain models, and outer service integrations (like ESP networks) adapt to the domain.

## High-Level Architecture Diagram

```mermaid
flowchart TD
    A[Application Layer] --> B[Email Service API]
    B --> C{Security Firewall}
    C -- Rejected --> D[Error / Drop]
    C -- Passed --> E[Developer Interceptors]
    E -- Intercepted --> F[Log to Dev Sink]
    E -- Proceed --> G[Template Engine]
    G --> H[Queue System MemoryQueue]
    H --> I[Token Bucket Rate Limiter]
    I --> J{Provider Registry}
    J -->|Primary| K[Resend Provider]
    J -->|Fallback 1| L[SendGrid Provider]
    J -->|Fallback N| M[SES Provider]
    K -. Fail .-> J
```

## Components

- **Email Service**: The core orchestrator.
- **Queue Adapter**: Manages egress flow, retries, and asynchronous dispatch.
- **Provider Registry**: Maintains the active and fallback ESP plugins.
- **Template Renderer**: Transforms React-based markup to dual HTML and text.
