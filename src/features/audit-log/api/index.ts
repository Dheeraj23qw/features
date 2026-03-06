import {
  auditService,
  AuditAction,
  ActorType,
  AuditContext,
  AuditEvent,
  AuditFilter,
  PaginatedAuditEvents,
} from "../index";

export async function logUserLogin(
  actorId: string,
  context?: AuditContext
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.USER_LOGIN,
      actorId,
      actorType: ActorType.USER,
    },
    context
  );
}

export async function logUserLogout(
  actorId: string,
  context?: AuditContext
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.USER_LOGOUT,
      actorId,
      actorType: ActorType.USER,
    },
    context
  );
}

export async function logFailedLogin(
  actorId: string,
  context?: AuditContext,
  metadata?: Record<string, unknown>
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.USER_LOGIN_FAILED,
      actorId,
      actorType: ActorType.USER,
      metadata,
    },
    context
  );
}

export async function logUserCreated(
  actorId: string,
  newUserId: string,
  context?: AuditContext
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.USER_CREATED,
      actorId,
      actorType: ActorType.USER,
      resourceType: "USER",
      resourceId: newUserId,
    },
    context
  );
}

export async function logUserUpdated(
  actorId: string,
  userId: string,
  previousValue?: Record<string, unknown>,
  newValue?: Record<string, unknown>,
  context?: AuditContext
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.USER_UPDATED,
      actorId,
      actorType: ActorType.USER,
      resourceType: "USER",
      resourceId: userId,
      previousValue,
      newValue,
    },
    context
  );
}

export async function logRoleAssigned(
  actorId: string,
  targetUserId: string,
  role: string,
  context?: AuditContext
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.ROLE_ASSIGNED,
      actorId,
      actorType: ActorType.USER,
      resourceType: "USER",
      resourceId: targetUserId,
      metadata: { role },
    },
    context
  );
}

export async function logPermissionGranted(
  actorId: string,
  targetUserId: string,
  permission: string,
  context?: AuditContext
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.PERMISSION_GRANTED,
      actorId,
      actorType: ActorType.USER,
      resourceType: "USER",
      resourceId: targetUserId,
      metadata: { permission },
    },
    context
  );
}

export async function logSecurityEvent(
  actorId: string,
  eventType: string,
  details: Record<string, unknown>,
  context?: AuditContext
): Promise<AuditEvent> {
  return auditService.log(
    {
      action: AuditAction.SECURITY_EVENT,
      actorId,
      actorType: ActorType.USER,
      metadata: { eventType, ...details },
    },
    context
  );
}

export async function queryAuditLogs(
  filter: AuditFilter
): Promise<PaginatedAuditEvents> {
  return auditService.query(filter);
}

export async function getUserActivity(
  userId: string,
  limit?: number
): Promise<AuditEvent[]> {
  return auditService.findByActor(userId, limit);
}

export async function getResourceHistory(
  resourceType: string,
  resourceId: string,
  limit?: number
): Promise<AuditEvent[]> {
  return auditService.findByResource(resourceType, resourceId, limit);
}

export async function verifyAuditIntegrity(): Promise<{
  isValid: boolean;
  brokenChain: AuditEvent[];
}> {
  return auditService.verifyIntegrity();
}
