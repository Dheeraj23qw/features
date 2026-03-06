# Overview

The Enterprise Audit Log Module (`src/features/audit-log`) provides a comprehensive event tracking system for recording and querying system activities. It follows Clean Architecture principles with a pluggable store adapter pattern.

## Key Features

- **Event Tracking**: Log user actions, security events, resource modifications
- **Store Adapters**: In-memory, PostgreSQL, MySQL, MongoDB support
- **Tamper Detection**: SHA-256 hash chain for event integrity
- **Append-Only**: Events cannot be modified once written
- **Automatic Context**: Captures IP, user-agent, request ID
- **Event Emitter**: Integrations for monitoring and analytics
- **Query API**: Filter by actor, resource, action, date range

## Table of Contents

1. [Architecture](./architecture.md)
2. [Domain Models](./domain-models.md)
3. [Store Adapters](./stores.md)
4. [Audit Service](./audit-service.md)
5. [Context Capture](./context.md)
6. [HTTP Middleware](./middleware.md)
7. [Security](./security.md)
8. [Query API](./query-api.md)
