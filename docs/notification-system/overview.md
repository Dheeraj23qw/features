# Overview

The Enterprise Notification Module (`src/features/notification`) provides a unified interface for delivering transactional messages across multiple channels. It processes notification payloads through isolated adapters, with built-in deduplication and delivery fallbacks.

## Key Features

- **Multi-Channel Support**: Email, SMS, Push, and Webhook delivery
- **Provider Adapters**: Pluggable provider architecture for each channel
- **Queue Processing**: Asynchronous processing with priority scheduling
- **Deduplication**: Idempotency checking to prevent duplicate deliveries
- **Fallback Routing**: Automatic channel fallback on provider failures
- **Rate Limiting**: Per-user sliding window rate limiting
- **Structured Logging**: JSON telemetry for all notification events

## Table of Contents

1. [Architecture](./architecture.md)
2. [Domain Models](./domain-models.md)
3. [Providers](./providers.md)
4. [Queue System](./queue-system.md)
5. [Routing logic](./routing.md)
6. [Security](./security.md)
7. [Observability](./observability.md)
