# Directory Structure

The rate limiter module is self-contained within `src/features/rate-limit/`.

```
src/features/rate-limit/
├── api/
│   └── middleware.ts           # Next.js middleware wrapper
├── config/
│   └── rateLimit.config.ts     # Zod-validated configuration
├── services/
│   └── RateLimitService.ts     # Core orchestration service
├── stores/
│   ├── memory.store.ts         # In-memory storage with GC
│   └── redis.store.ts          # Redis storage adapter
├── strategies/
│   ├── fixed-window.ts         # Fixed window algorithm
│   ├── sliding-window.ts      # Sliding window algorithm
│   └── token-bucket.ts        # Token bucket algorithm
├── types/
│   └── index.ts                # TypeScript interfaces
├── utils/
│   ├── errors.ts               # Error classes
│   └── keyGenerator.ts         # Key generation utilities
└── index.ts                    # Public exports
```

## Layer Responsibilities

| Directory | Purpose |
|-----------|---------|
| `api/` | HTTP middleware integration |
| `config/` | Environment configuration |
| `services/` | Core business logic |
| `stores/` | Data persistence |
| `strategies/` | Throttling algorithms |
| `types/` | Type definitions |
| `utils/` | Helpers and utilities |
