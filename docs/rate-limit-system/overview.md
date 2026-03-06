# Overview

The Enterprise Rate Limiting Module (`src/features/rate-limit`) provides API protection through configurable throttling strategies. It abstracts caching engines (Redis/Memory) and algorithms (Token Bucket/Sliding Window), keeping route controllers clean.

## Key Features

- **Domain-Driven Models**: Strict TypeScript definitions for configurations and results
- **Throttling Strategies**: Token Bucket, Fixed Window, and Sliding Window algorithms
- **Storage Adapters**: In-memory or Redis-based persistence
- **Next.js Middleware**: Easy integration with Next.js route handlers
- **Fail-Open Design**: Falls back to allowing requests if Redis is unavailable

## Table of Contents

1. [Architecture](./architecture.md)
2. [Directory Structure](./directory-structure.md)
3. [Domain Types & Models](./domain-models.md)
4. [Strategies & Algorithms](./strategies.md)
5. [Storage Adapters](./storage-adapters.md)
6. [Core Service](./core-service.md)
7. [HTTP Middleware](./middleware.md)
8. [Extension Guides](./extension-guides.md)
