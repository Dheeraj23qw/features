# Overview

The Enterprise Email Module (`src/features/email`) is designed to isolate the complexities of sending emails behind a strictly typed boundary. It abstracts away Email Service Providers (ESPs) such as Resend, SendGrid, and SES, ensuring that your application's business logic remains oblivious to the underlying delivery mechanism.

## Key Features

- **Domain-Driven Models**: Strict structural definitions for emails.
- **Provider Plugin Architecture**: Agnostic ESP integration with automatic fallbacks.
- **Advanced Queueing**: In-memory queue with rate limiting, retries, and priority scheduling.
- **Type-Safe Templates**: Compile-time safety for React Email templates.
- **Security & Compliance**: Out-of-the-box disposable email blocking and unsubscribe header injection.
- **Developer Experience**: Interceptors for dry runs and local dev sinks.
- **Observability**: Structured JSON logging and decoupled Event Emitters.

## Table of Contents
1. [Architecture](./architecture.md)
2. [Directory Structure](./directory-structure.md)
3. [Email Lifecycle](./email-lifecycle.md)
4. [Domain Models](./domain-models.md)
5. [Provider Architecture](./provider-architecture.md)
6. [Queue System](./queue-system.md)
7. [Template Engine](./template-engine.md)
8. [Security Layer](./security-layer.md)
9. [Developer Experience](./developer-experience.md)
10. [Observability](./observability.md)
11. [Extension Guides](./extension-guides.md)
