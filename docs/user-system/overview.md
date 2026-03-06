# Overview

The Enterprise User Feature Module (`src/features/user/`) manages everything related to a user's identity, profile, and state — **without touching authentication**. It is designed to be loosely coupled, store-agnostic, and reusable.

## Responsibilities

| Responsibility | Owner |
|---|---|
| User CRUD & role management | `UserService` |
| Profile (name, bio, avatar) | `ProfileService` |
| Preferences (theme, language, layout) | `UserManager` + `PreferenceStore` |
| User status lifecycle | `UserLifecycleService` |
| Search, filtering, pagination | `UserSearchService` |
| Structured event emission | `UserEvents` |
| Structured log telemetry | `UserLogger` |

## Design Principles

- **Soft deletes only** — no records are ever physically removed. Status transitions to `DELETED`.
- **Store-agnostic** — `UserStore`, `ProfileStore`, and `PreferenceStore` are interfaces. Swap `MemoryStore` → `PrismaStore` with zero changes outside the store layer.
- **Event-driven observability** — all mutations emit typed `UserEvents`, consumed by `UserLogger` and any custom listeners.
- **Strict public boundary** — everything internal.  Only `index.ts` exports are accessible to consuming code.
