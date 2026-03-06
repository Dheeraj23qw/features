# Architecture

The notification system follows Domain-Driven Design principles with clear separation between domain logic, application services, and infrastructure adapters.

## High-Level Flow

```mermaid
flowchart TD
    A[Public Next.js API] --> B[NotificationService]
    B --> C{Deduplication Check}
    C -- Blocked --> D[Drop]
    C -- Passed --> E{Rate Limiter}
    
    E -- Blocked --> F[Exception 429]
    E -- Passed --> G{Template Renderer}
    G --> H[Event: notification.created]
    
    H --> I[NotificationQueue]
    I -->|Resolves priority & schedule| J{NotificationRouter}
    
    J --> K[Zod Provider Mapping]
    K -->|EmailStub| L[Email Node]
    K -->|SMSStub| M[SMS Node]
    K -->|PushStub| N[Push Node]
    
    L -- Failed --> O{ChannelStrategy Fallback}
    O -- Permits --> J
    
    L -- Throw Error --> P{RetryStrategy}
    P -- Within attempt limit --> I
    P -- Exceeded --> Q[Event: notification.failed]
```

## Components

| Component | Responsibility |
|-----------|----------------|
| `NotificationService` | Entry point, validates and dispatches notifications |
| `DeduplicationCheck` | Prevents duplicate deliveries using message ID |
| `RateLimiter` | Enforces per-user rate limits |
| `NotificationQueue` | Manages async processing and priority |
| `NotificationRouter` | Routes to appropriate provider adapter |
| `RetryStrategy` | Handles failed delivery retries with exponential backoff |
