# Architecture

The rate limiter follows Feature-Based Domain-Driven Design principles with clear separation between configuration, core service, strategy, and storage layers.

## High-Level Architecture Diagram

```mermaid
flowchart TD
    A[Next.js App Route Handler] --> B[Middleware API layer]
    B --> C{SkipIf Hooks}
    C -- Bypassed --> D[Resolve Route]
    C -- Regulated --> E[RateLimitService Singleton]
    
    E --> F[Key Generator Engine]
    E --> G[Zod Environment Config]
    
    F --> H{Active Strategy Engine}
    H -->|Algorithm 1| I[Fixed Window]
    H -->|Algorithm 2| J[Token Bucket]
    H -->|Algorithm 3| K[Sliding Window]
    
    H --> L{Active Store Adapter}
    L -->|Dev| M[MemoryStore Map w/ GC]
    L -->|Prod| N[RedisStore Client]
    
    L -- Count Evaluated --> H
    H --> E
    E --> O{Threshold Validator}
    O -- Blocked --> P[429 JSON Error + Headers]
    O -- Allowed --> Q[Proceed + Header Injection]
```

## System Components

| Layer | Responsibility |
|-------|----------------|
| Configuration Layer | Validates env vars with Zod, provides defaults |
| Core Service | Central hub for rule retrieval and key mapping |
| Algorithm Layer | Implements throttling mathematics |
| Storage Layer | Persistence (Memory or Redis) |

## Data Flow

1. Request hits middleware
2. Check skip conditions (bypass hooks)
3. Generate rate limit key
4. Apply strategy algorithm
5. Query storage for current count
6. Validate against limit
7. Return 429 or proceed
