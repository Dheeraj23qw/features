# Directory Structure

```text
src/features/auth/
├── api/                       # Public API functions (the only "surface area")
│   ├── login.ts
│   ├── register.ts
│   ├── logout.ts
│   ├── refreshToken.ts
│   ├── resetPassword.ts       # Also contains verifyEmail & requestPasswordReset
│   └── middleware.ts          # requireAuth, requirePermission, requireRole
│
├── domain/                    # Pure models — zero external deps
│   ├── models.ts              # User, Session, StoredToken interfaces
│   ├── enums.ts               # AuthStrategy, UserStatus, TokenType, MFAMethod …
│   └── permissions.ts         # Role enum, Permission enum, RolePermissions map
│
├── events/
│   └── AuthEvents.ts          # Typed Node.js EventEmitter
│
├── logger/
│   └── AuthLogger.ts          # Structured JSON logger (auto-subscribes to AuthEvents)
│
├── providers/                 # OAuth adapters
│   ├── OAuthProvider.ts       # Base interface + UserProfile type
│   ├── GoogleProvider.ts
│   └── GitHubProvider.ts
│
├── security/                  # Cryptographic primitives
│   ├── PasswordHasher.ts      # bcrypt hash / verify (timing-safe)
│   ├── TokenSigner.ts         # JWT sign / verify
│   ├── BruteForceProtection.ts # In-memory lockout with exponential window
│   └── MFAService.ts          # TOTP secret generation & Email OTP
│
├── services/                  # Business logic orchestration
│   ├── AuthService.ts         # Singleton — the "command center"
│   ├── TokenService.ts        # Access, Refresh, Verification, Reset tokens
│   ├── SessionService.ts      # Multi-device session lifecycle
│   └── PasswordService.ts     # Thin wrapper over PasswordHasher
│
├── stores/                    # Interface + memory implementations
│   └── index.ts               # UserStore, SessionStore, TokenStore
│
├── strategies/
│   ├── JWTStrategy.ts         # Bearer header extraction
│   └── OAuthStrategy.ts       # Provider registry
│
├── types/
│   └── index.ts               # AuthPayload, AuthResult, UserSession
│
├── utils/
│   ├── config.ts              # Zod-validated environment config
│   ├── errors.ts              # Typed custom AuthError subclasses
│   └── validators.ts          # Zod schemas: loginSchema, registerSchema …
│
└── index.ts                   # ← The ONLY public boundary
```
