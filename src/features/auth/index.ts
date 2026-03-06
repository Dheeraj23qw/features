// Public API Functions
export { login } from "./api/login";
export { register } from "./api/register";
export { logout } from "./api/logout";
export { refreshToken } from "./api/refreshToken";
export { verifyEmail, requestPasswordReset, resetPassword } from "./api/resetPassword";
export { requireAuth, requirePermission, requireRole } from "./api/middleware";

// Core Service (for advanced use)
export { AuthService } from "./services/AuthService";

// Public Types
export type { AuthPayload, AuthResult, UserSession } from "./types/index";
export type { User, Session } from "./domain/models";

// Enums & RBAC
export { Role, Permission, getUserPermissions, hasPermission } from "./domain/permissions";
export { AuthStrategy, UserStatus, TokenType, OAuthProviderType, MFAMethod } from "./domain/enums";

// Validators
export { loginSchema, registerSchema, resetPasswordSchema } from "./utils/validators";
export type { LoginInput, RegisterInput, ResetPasswordInput } from "./utils/validators";

// Errors
export {
    AuthError,
    InvalidCredentialsError,
    AccountLockedError,
    TokenExpiredError,
    TokenInvalidError,
    EmailNotVerifiedError,
    MFARequiredError,
    PermissionDeniedError,
    UserNotFoundError,
    UserAlreadyExistsError,
} from "./utils/errors";
