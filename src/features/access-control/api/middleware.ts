import { AuthorizationError } from "../utils/errors";
import { AccessControlService } from "../services/access.service";

export interface AuthorizeOptions {
  resource: string;
  action: string;
  resourceIdParam?: string;
  ownerField?: string;
}

export interface RequestWithUser {
  userId?: string;
  headers: Record<string, string | string[] | undefined>;
  params?: Record<string, string>;
  body?: Record<string, unknown>;
}

export function createAuthorizeMiddleware(accessControl: AccessControlService) {
  return function authorize(options: AuthorizeOptions) {
    return async function (
      request: RequestWithUser,
      handler: (request: RequestWithUser) => Promise<unknown>
    ): Promise<unknown> {
      const userId = request.userId;

      if (!userId) {
        throw new AuthorizationError(
          "Authentication required",
          "UNAUTHORIZED",
          401
        );
      }

      const context: { resourceOwnerId?: string } = {};

      if (options.resourceIdParam && request.params) {
        const resourceId = request.params[options.resourceIdParam];
        if (resourceId && options.ownerField && request.body) {
          context.resourceOwnerId = request.body[options.ownerField] as string;
        }
      }

      const hasAccess = await accessControl.can(
        userId,
        options.action,
        options.resource,
        context
      );

      if (!hasAccess) {
        throw new AuthorizationError(
          `You do not have permission to ${options.action} ${options.resource}`,
          "FORBIDDEN",
          403
        );
      }

      return handler(request);
    };
  };
}

export function requirePermission(
  accessControl: AccessControlService,
  permission: string
) {
  return async function (
    userId: string,
    handler: () => Promise<unknown>
  ): Promise<unknown> {
    const hasPermission = await accessControl.hasPermission(userId, permission);

    if (!hasPermission) {
      throw new AuthorizationError(
        `Missing required permission: ${permission}`,
        "FORBIDDEN",
        403
      );
    }

    return handler();
  };
}

export function requireRole(accessControl: AccessControlService, roleName: string) {
  return async function (
    userId: string,
    handler: () => Promise<unknown>
  ): Promise<unknown> {
    const roles = await accessControl.getUserRoles(userId);
    const hasRole = roles.some((r) => r.name === roleName);

    if (!hasRole) {
      throw new AuthorizationError(
        `Required role: ${roleName}`,
        "FORBIDDEN",
        403
      );
    }

    return handler();
  };
}
