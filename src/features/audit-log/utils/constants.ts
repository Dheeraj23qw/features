export const AUDIT_CONFIG = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 1000,
  HASH_ALGORITHM: "sha256",
  EVENT_ID_LENGTH: 36,
} as const;

export const SENSITIVE_FIELDS = [
  "password",
  "passwordHash",
  "secret",
  "token",
  "accessToken",
  "refreshToken",
  "apiKey",
  "privateKey",
  "ssn",
  "creditCard",
] as const;

export function isSensitiveField(field: string): boolean {
  return SENSITIVE_FIELDS.some((f) => field.toLowerCase().includes(f.toLowerCase()));
}

export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (isSensitiveField(key)) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

export const AUDIT_ACTION_CATEGORIES = {
  AUTHENTICATION: [
    "USER_LOGIN",
    "USER_LOGOUT",
    "USER_LOGIN_FAILED",
    "USER_PASSWORD_CHANGED",
    "USER_PASSWORD_RESET_REQUESTED",
    "USER_PASSWORD_RESET_COMPLETED",
    "USER_MFA_ENABLED",
    "USER_MFA_DISABLED",
    "USER_MFA_CHALLENGE",
  ],
  ACCOUNT: [
    "USER_CREATED",
    "USER_UPDATED",
    "USER_DELETED",
    "USER_SUSPENDED",
    "USER_ACTIVATED",
    "USER_PROFILE_UPDATED",
  ],
  PERMISSIONS: [
    "ROLE_ASSIGNED",
    "ROLE_REMOVED",
    "PERMISSION_GRANTED",
    "PERMISSION_REVOKED",
  ],
  SECURITY: [
    "SECURITY_EVENT",
    "SUSPICIOUS_ACTIVITY",
    "RATE_LIMIT_EXCEEDED",
    "INVALID_TOKEN",
    "TOKEN_REVOKED",
  ],
  ADMIN: [
    "ADMIN_ACTION",
    "SYSTEM_CONFIG_CHANGED",
    "BULK_OPERATION",
  ],
} as const;
