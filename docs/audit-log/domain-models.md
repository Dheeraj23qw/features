# Domain Models

## AuditAction

Defines the type of action being audited.

```typescript
export enum AuditAction {
  // Authentication
  USER_LOGIN = "USER_LOGIN",
  USER_LOGOUT = "USER_LOGOUT",
  USER_LOGIN_FAILED = "USER_LOGIN_FAILED",
  USER_PASSWORD_CHANGED = "USER_PASSWORD_CHANGED",
  USER_PASSWORD_RESET_REQUESTED = "USER_PASSWORD_RESET_REQUESTED",
  USER_MFA_ENABLED = "USER_MFA_ENABLED",
  USER_MFA_DISABLED = "USER_MFA_DISABLED",

  // Account
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  USER_DELETED = "USER_DELETED",
  USER_SUSPENDED = "USER_SUSPENDED",
  USER_PROFILE_UPDATED = "USER_PROFILE_UPDATED",

  // Permissions
  ROLE_ASSIGNED = "ROLE_ASSIGNED",
  ROLE_REMOVED = "ROLE_REMOVED",
  PERMISSION_GRANTED = "PERMISSION_GRANTED",
  PERMISSION_REVOKED = "PERMISSION_REVOKED",

  // Resources
  RESOURCE_CREATED = "RESOURCE_CREATED",
  RESOURCE_UPDATED = "RESOURCE_UPDATED",
  RESOURCE_DELETED = "RESOURCE_DELETED",
  RESOURCE_VIEWED = "RESOURCE_VIEWED",

  // Security
  SECURITY_EVENT = "SECURITY_EVENT",
  SUSPICIOUS_ACTIVITY = "SUSPICIOUS_ACTIVITY",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  INVALID_TOKEN = "INVALID_TOKEN",

  // Admin
  ADMIN_ACTION = "ADMIN_ACTION",
  SYSTEM_CONFIG_CHANGED = "SYSTEM_CONFIG_CHANGED",

  // API
  API_REQUEST = "API_REQUEST",
  API_ERROR = "API_ERROR",
}
```

## ActorType

Identifies the type of actor performing the action.

```typescript
export enum ActorType {
  USER = "USER",
  SYSTEM = "SYSTEM",
  SERVICE = "SERVICE",
  ANONYMOUS = "ANONYMOUS",
}
```

## ResourceType

Identifies the type of resource being acted upon.

```typescript
export enum ResourceType {
  USER = "USER",
  ROLE = "ROLE",
  PERMISSION = "PERMISSION",
  SESSION = "SESSION",
  FILE = "FILE",
  CONFIG = "CONFIG",
  API_KEY = "API_KEY",
  CUSTOM = "CUSTOM",
}
```

## AuditSeverity

Indicates the severity level of the audit event.

```typescript
export enum AuditSeverity {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARNING = "WARNING",
  ERROR = "ERROR",
  CRITICAL = "CRITICAL",
}
```

## AuditEvent

The core domain model representing a single audit entry.

```typescript
export interface AuditEvent {
  eventId: string;
  action: AuditAction | string;
  actorId: string;
  actorType: ActorType;
  resourceType?: ResourceType | string;
  resourceId?: string;
  timestamp: Date;
  metadata?: AuditMetadata;
  context?: AuditContext;
  severity?: AuditSeverity;
  description?: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  eventHash?: string;
  previousEventHash?: string;
}
```

## AuditEventInput

Input model for creating new audit events.

```typescript
export interface AuditEventInput {
  action: AuditAction | string;
  actorId: string;
  actorType?: ActorType;
  resourceType?: ResourceType | string;
  resourceId?: string;
  metadata?: AuditMetadata;
  description?: string;
  previousValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
}
```

## AuditFilter

Filter options for querying audit events.

```typescript
export interface AuditFilter {
  actorId?: string;
  actorType?: ActorType;
  action?: string | string[];
  resourceType?: string;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  severity?: AuditSeverity;
  limit?: number;
  offset?: number;
}
```
