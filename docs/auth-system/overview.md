# Auth System — Overview

The Enterprise Authentication Module is a secure, extensible, and fully self-contained authentication solution residing in `src/features/auth/`.

## Core Design Goals

| Goal | How it is met |
|------|--------------|
| **Security First** | Bcrypt password hashing, brute-force lockout, JWT signing, TOTP/OTP MFA |
| **Provider Agnostic** | Strategy + Adapter patterns decouple logic from identity providers |
| **Extensible RBAC** | Role/Permission maps resolve at runtime; no hardcoded checks in business logic |
| **Decoupled Stores** | `UserStore`, `SessionStore`, and `TokenStore` are interfaces — swap `MemoryStore` for Prisma/Redis with zero core changes |
| **Feature Isolated** | Entire module lives behind `index.ts`. Nothing internal leaks outward |
| **Observable** | Every lifecycle event emits a typed `AuthEvent` consumed by structured logging |

## Supported Authentication Flows

- **Email / Password** — with brute-force protection, MFA challenge, and account lockout
- **OAuth 2.0** — Google, GitHub (pluggable adapters)
- **JWT + Refresh Token Rotation** — Stateless access with stateful refresh
- **Multi-Factor Authentication** — TOTP (app-based) and Email OTP
- **Email Verification** — Activation link via time-limited tokens
- **Password Reset** — Secure reset flow with auto-expiring tokens
