import { AuditService } from "./services/audit.service";
import { MemoryAuditStore } from "./stores/memory.store";
import { auditEvents } from "./domain/events";
import { createAuditMiddleware } from "./middlewares/audit.middleware";

const defaultStore = new MemoryAuditStore();

const defaultAuditService = new AuditService({
  store: defaultStore,
});

defaultAuditService.initialize().catch(console.error);

export { AuditService, defaultAuditService as auditService, auditEvents, createAuditMiddleware, MemoryAuditStore };

export type { AuditStore } from "./stores/audit.store";
export type { DatabaseAuditStoreOptions, DatabaseClient } from "./stores/database.store";

export type {
  AuditEvent,
  AuditEventInput,
  AuditMetadata,
  AuditContext,
  AuditFilter,
  PaginatedAuditEvents,
} from "./domain/models";

export {
  AuditAction,
  ActorType,
  ResourceType,
  AuditSeverity,
} from "./domain/models";

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
} from "./utils/context";

export type { RequestContext } from "./utils/context";

export {
  AUDIT_CONFIG,
  SENSITIVE_FIELDS,
  isSensitiveField,
  sanitizeObject,
  AUDIT_ACTION_CATEGORIES,
} from "./utils/constants";

export type { AuditMiddlewareOptions, RequestLike } from "./middlewares/audit.middleware";
