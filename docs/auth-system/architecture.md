# Architecture

## System Diagram

```mermaid
flowchart TD
    Client((Client)) --> API(Public API: login / register / logout)
    
    subgraph Core Orchestration
        API --> AuthService[AuthService Singleton]
        AuthService --> BF[BruteForceProtection]
        AuthService --> PS[PasswordService]
        AuthService --> TS[TokenService]
        AuthService --> SS[SessionService]
        AuthService --> MFA[MFAService]
    end
    
    subgraph Identity Providers
        AuthService --> OAuth{OAuthStrategy}
        OAuth --> Google[GoogleProvider]
        OAuth --> GitHub[GitHubProvider]
    end
    
    subgraph Stores
        TS --> TokenStore[(TokenStore)]
        SS --> SessionStore[(SessionStore)]
        AuthService --> UserStore[(UserStore)]
    end
    
    subgraph Security
        PS --> PH[PasswordHasher - bcrypt]
        TS --> Signer[TokenSigner - JWT]
    end
    
    subgraph Observability
        AuthService -.-> Events((AuthEvents))
        Events --> Logger[AuthLogger]
    end
    
    subgraph Middleware
        API --> MW[requireAuth / requirePermission]
        MW --> JWT[JWTStrategy]
        MW --> RBAC[RolePermissions Map]
    end
```

## Architectural Layers

1. **API Layer (`api/`)** — Thin public wrappers. The only entry point from consuming code.
2. **Service Layer (`services/`)** — All orchestration lives here: `AuthService`, `TokenService`, `SessionService`, `PasswordService`.
3. **Security Layer (`security/`)** — Cryptographic primitives and protection: `PasswordHasher`, `TokenSigner`, `BruteForceProtection`, `MFAService`.
4. **Provider/Strategy Layer (`providers/`, `strategies/`)** — OAuth adapters and JWT extraction strategies.
5. **Store Layer (`stores/`)** — Interface-driven persistence: swap Memory → Prisma → Redis without touching core logic.
6. **Domain Layer (`domain/`)** — Pure TypeScript models, enums, and RBAC maps with zero external dependencies.
