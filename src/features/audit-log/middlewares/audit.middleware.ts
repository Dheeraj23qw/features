import { AuditAction, ActorType } from "../domain/models";
import { AuditService } from "../services/audit.service";
import {
  extractContextFromRequest,
  getAuditContext,
  clearAuditContext,
} from "../utils/context";
import { sanitizeObject } from "../utils/constants";

export interface AuditMiddlewareOptions {
  auditService: AuditService;
  getUserId?: (request: RequestLike) => string | undefined;
  getUserType?: (request: RequestLike) => ActorType;
  getResourceFromPath?: (path: string) => { type: string; id: string } | null;
  excludePaths?: string[];
  includePaths?: string[];
  sensitiveFields?: string[];
}

export interface RequestLike {
  headers: Record<string, string | string[] | undefined>;
  method?: string;
  url?: string;
  nextUrl?: {
    pathname: string;
  };
}

type NextHandler = (request: RequestLike) => Promise<Response> | Response;

export function createAuditMiddleware(options: AuditMiddlewareOptions) {
  const {
    auditService,
    getUserId,
    getUserType,
    getResourceFromPath,
    excludePaths = [],
    includePaths,
    sensitiveFields = [],
  } = options;

  const isPathExcluded = (path: string): boolean => {
    if (excludePaths.length === 0) return false;
    return excludePaths.some((excluded) => path.includes(excluded));
  };

  const isPathIncluded = (path: string): boolean => {
    if (!includePaths || includePaths.length === 0) return true;
    return includePaths.some((included) => path.includes(included));
  };

  return function auditMiddleware(
    action: AuditAction | string,
    handler: NextHandler
  ): NextHandler {
    return async function auditedHandler(request: RequestLike): Promise<Response> {
      const path = request.nextUrl?.pathname || request.url || "";

      if (isPathExcluded(path) || !isPathIncluded(path)) {
        return handler(request);
      }

      const context = extractContextFromRequest(request.headers);
      const userId = getUserId ? getUserId(request) : undefined;
      const userType = getUserType ? getUserType(request) : ActorType.USER;

      let resourceType: string | undefined;
      let resourceId: string | undefined;

      if (getResourceFromPath) {
        const resource = getResourceFromPath(path);
        if (resource) {
          resourceType = resource.type;
          resourceId = resource.id;
        }
      }

      try {
        const response = await handler(request);
        
        if (response.status >= 200 && response.status < 300) {
          await auditService.log(
            {
              action,
              actorId: userId || context.ipAddress || "anonymous",
              actorType: userId ? userType : ActorType.ANONYMOUS,
              resourceType,
              resourceId,
              metadata: {
                method: request.method,
                path,
                status: response.status,
              },
            },
            context
          );
        }

        return response;
      } catch (error) {
        await auditService.log(
          {
            action: AuditAction.API_ERROR,
            actorId: userId || context.ipAddress || "anonymous",
            actorType: userId ? userType : ActorType.ANONYMOUS,
            resourceType,
            resourceId,
            metadata: {
              method: request.method,
              path,
              error: error instanceof Error ? error.message : "Unknown error",
            },
          },
          context
        );

        throw error;
      } finally {
        clearAuditContext();
      }
    };
  };
}

export function auditEndpoint(options: AuditMiddlewareOptions) {
  const middleware = createAuditMiddleware(options);
  
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (request: RequestLike) {
      const action = (target as Record<string, unknown>)[propertyKey] 
        ? `${propertyKey.toUpperCase()}_ACTION`
        : AuditAction.API_REQUEST;
      
      const auditedHandler = middleware(action as AuditAction, originalMethod.bind(this, request));
      return auditedHandler(request);
    };
    
    return descriptor;
  };
}

export function withAuditLogging(
  auditService: AuditService,
  options?: {
    getUserId?: (request: RequestLike) => string | undefined;
    sensitiveFields?: string[];
  }
) {
  return async function logAudit(
    request: RequestLike,
    action: AuditAction,
    details?: {
      resourceType?: string;
      resourceId?: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    const context = extractContextFromRequest(request.headers);
    const userId = options?.getUserId ? options.getUserId(request) : undefined;

    let metadata = details?.metadata || {};
    if (options?.sensitiveFields && metadata) {
      metadata = sanitizeObject(metadata);
    }

    return auditService.log(
      {
        action,
        actorId: userId || context.ipAddress || "anonymous",
        actorType: userId ? ActorType.USER : ActorType.ANONYMOUS,
        resourceType: details?.resourceType,
        resourceId: details?.resourceId,
        metadata,
      },
      context
    );
  };
}
