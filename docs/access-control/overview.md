# Overview

The Enterprise Access Control Module (`src/features/access-control`) provides a comprehensive RBAC (Role-Based Access Control) system with support for permission policies. It follows Clean Architecture principles with a pluggable store adapter pattern.

## Key Features

- **RBAC**: Role-based access control with multi-role users
- **Permission Management**: Flexible permission system with wildcard support
- **Policy Engine**: Custom authorization rules beyond basic permissions
- **Store Adapters**: Pluggable storage (Memory, PostgreSQL, MySQL, MongoDB)
- **Middleware**: Easy route protection for Next.js
- **Error Handling**: Standardized authorization errors
- **Future-Ready**: Designed for ABAC (Attribute-Based Access Control)

## Table of Contents

1. [Architecture](./architecture.md)
2. [Domain Models](./domain-models.md)
3. [Store Adapters](./stores.md)
4. [Access Control Service](./access-service.md)
5. [Policy Engine](./policy-engine.md)
6. [Middleware](./middleware.md)
7. [Security](./security.md)
