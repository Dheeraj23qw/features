// ── API Functions ──────────────────────────────────────────────────────────
export { getUser } from "./api/getUser";
export { updateUser, updateProfile } from "./api/updateUser";
export { deleteUser } from "./api/deleteUser";
export { listUsers } from "./api/listUsers";
export { getPreferences, updatePreferences } from "./api/updatePreferences";

// ── Core Orchestrator (for advanced use) ───────────────────────────────────
export { UserManager } from "./services/UserManager";

// ── Individual Services (for advanced use) ─────────────────────────────────
export { UserService } from "./services/UserService";
export { ProfileService } from "./services/ProfileService";
export { UserSearchService } from "./services/UserSearchService";
export { UserLifecycleService } from "./services/UserLifecycleService";

// ── Public Types ───────────────────────────────────────────────────────────
export type {
    User,
    UserProfile,
    UserPreferences,
    UserUpdatePayload,
    ProfileUpdatePayload,
    PreferencesUpdatePayload,
    UserSearchQuery,
    PaginatedUsers,
} from "./types/index";

// ── Domain: Enums & RBAC ───────────────────────────────────────────────────
export { UserRole, UserStatus } from "./domain/enums";
export { hasUserPermission, UserRolePermissions } from "./domain/permissions";

// ── Validation Types ───────────────────────────────────────────────────────
export type { UpdateUserInput, UpdateProfileInput, UpdatePreferencesInput } from "./validation/UserValidator";

// ── Errors ─────────────────────────────────────────────────────────────────
export {
    UserError,
    UserNotFoundError,
    UserAlreadyExistsError,
    UserSuspendedError,
    UserDeletedError,
    InvalidStatusTransitionError,
    UserValidationError,
} from "./utils/errors";
