# Directory Structure

```text
src/features/user/
├── api/                        # Public-facing API wrappers
│   ├── getUser.ts
│   ├── updateUser.ts           # Also contains updateProfile
│   ├── deleteUser.ts
│   ├── listUsers.ts
│   └── updatePreferences.ts    # Also contains getPreferences
│
├── domain/                     # Pure models — zero external deps
│   ├── models.ts               # User, UserProfile, UserPreferences
│   ├── enums.ts                # UserRole, UserStatus
│   └── permissions.ts          # RolePermissions map + hasUserPermission()
│
├── events/
│   └── UserEvents.ts           # Typed EventEmitter for all user lifecycle events
│
├── logger/
│   └── UserLogger.ts           # Structured JSON logger (auto-subscribes)
│
├── services/
│   ├── UserManager.ts          # Singleton orchestrator wiring all services
│   ├── UserService.ts          # CRUD, role management, soft-delete
│   ├── ProfileService.ts       # Profile upsert + avatar hook
│   ├── UserSearchService.ts    # Filtering, search, pagination
│   └── UserLifecycleService.ts # Validated status transitions
│
├── stores/
│   ├── UserStore.ts            # Interface + MemoryUserStore
│   ├── ProfileStore.ts         # Interface + MemoryProfileStore
│   └── PreferenceStore.ts      # Interface + MemoryPreferenceStore
│
├── types/
│   └── index.ts                # All public-safe TypeScript types
│
├── utils/
│   ├── config.ts               # Zod-validated env config
│   ├── errors.ts               # 7 typed error classes
│   └── mappers.ts              # DTO helpers / default-value builders
│
├── validation/
│   └── UserValidator.ts        # Zod Schemas + UserValidator class
│
└── index.ts                    # ← The ONLY public boundary
```
