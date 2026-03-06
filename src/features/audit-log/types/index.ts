export type {
  AuditAction,
  ActorType,
  ResourceType,
  AuditSeverity,
  AuditEvent,
  AuditEventInput,
  AuditMetadata,
  AuditContext,
  AuditFilter,
  PaginatedAuditEvents,
} from "../domain/models";

export type { AuditStore } from "../stores/audit.store";
export { MemoryAuditStore } from "../stores/memory.store";
export type {
  DatabaseAuditStoreOptions,
  DatabaseClient,
  DatabaseCollection,
  DatabaseQuery,
  DatabaseType,
} from "../stores/database.store";

export { AuditService } from "../services/audit.service";
export type { AuditServiceOptions } from "../services/audit.service";

export { AuditEvents, auditEvents } from "../domain/events";
export type {
  AuditLoggedEvent,
  AuditFailedEvent,
  AuditQueryEvent,
} from "../domain/events";

export {
  AuditContextManager,
  createAuditContext,
  extractContextFromRequest,
  getClientIp,
  getUserAgent,
  getRequestId,
  setAuditContext,
  getAuditContext,
  clearAuditContext,
} from "../utils/context";
export type { RequestContext } from "../utils/context";

export {
  AUDIT_CONFIG,
  SENSITIVE_FIELDS,
  isSensitiveField,
  sanitizeObject,
  AUDIT_ACTION_CATEGORIES,
} from "../utils/constants";

export {
  createAuditMiddleware,
  auditEndpoint,
  withAuditLogging,
} from "../middlewares/audit.middleware";
export type {
  AuditMiddlewareOptions,
  RequestLike,
} from "../middlewares/audit.middleware";
