import { randomUUID } from "crypto";
import { AuditContext } from "../domain/models";

export interface RequestContext {
  ipAddress?: string;
  userAgent?: string;
  requestId?: string;
  correlationId?: string;
  sessionId?: string;
  headers?: Record<string, string>;
}

const AUDIT_CONTEXT_KEY = "audit-context";

export function createAuditContext(request?: RequestContext): AuditContext {
  return {
    ipAddress: request?.ipAddress,
    userAgent: request?.userAgent,
    requestId: request?.requestId || randomUUID(),
    correlationId: request?.correlationId,
    sessionId: request?.sessionId,
  };
}

export function getClientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers["x-forwarded-for"];
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(",")[0];
    return ips.trim();
  }
  
  return (
    headers["x-real-ip"] ||
    headers["x-client-ip"] ||
    "unknown"
  ) as string;
}

export function getUserAgent(headers: Record<string, string | string[] | undefined>): string {
  return (headers["user-agent"] as string) || "unknown";
}

export function getRequestId(headers: Record<string, string | string[] | undefined>): string | undefined {
  return (
    headers["x-request-id"] as string ||
    headers["x-correlation-id"] as string ||
    headers["request-id"] as string
  );
}

export function extractContextFromRequest(headers: Record<string, string | string[] | undefined>): AuditContext {
  return {
    ipAddress: getClientIp(headers),
    userAgent: getUserAgent(headers),
    requestId: getRequestId(headers) || randomUUID(),
  };
}

const contextStorage = new Map<string, AuditContext>();

export function setAuditContext(context: AuditContext): void {
  contextStorage.set(AUDIT_CONTEXT_KEY, context);
}

export function getAuditContext(): AuditContext | undefined {
  return contextStorage.get(AUDIT_CONTEXT_KEY);
}

export function clearAuditContext(): void {
  contextStorage.delete(AUDIT_CONTEXT_KEY);
}

export class AuditContextManager {
  private static instance: AuditContextManager;
  private context: AuditContext | null = null;

  private constructor() {}

  static getInstance(): AuditContextManager {
    if (!AuditContextManager.instance) {
      AuditContextManager.instance = new AuditContextManager();
    }
    return AuditContextManager.instance;
  }

  setContext(context: AuditContext): void {
    this.context = context;
  }

  getContext(): AuditContext | null {
    return this.context;
  }

  clearContext(): void {
    this.context = null;
  }

  setFromRequest(headers: Record<string, string | string[] | undefined>): void {
    this.context = extractContextFromRequest(headers);
  }

  setAuthenticatedUser(actorId: string, sessionId?: string): void {
    if (this.context) {
      this.context.actorId = actorId;
      if (sessionId) {
        this.context.sessionId = sessionId;
      }
    } else {
      this.context = {
        requestId: randomUUID(),
        actorId,
        sessionId,
      };
    }
  }
}
