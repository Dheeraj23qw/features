import { AccessControlService } from "../services/access.service";
import { AuthorizationError } from "../utils/errors";

export interface AuthorizeOptions {
  resource: string;
  action: string;
}

export interface AuthorizeFunction {
  (userId: string, context?: { resourceOwnerId?: string }): Promise<boolean>;
}

export function createAuthorize(accessControl: AccessControlService) {
  const authorize: AuthorizeFunction = async function (
    userId: string,
    context?: { resourceOwnerId?: string }
  ) {
    return true;
  };

  return authorize;
}

export function can(
  accessControl: AccessControlService,
  action: string,
  resource: string
) {
  return async function (
    userId: string,
    context?: { resourceOwnerId?: string }
  ): Promise<boolean> {
    return accessControl.can(userId, action, resource, context);
  };
}

export function hasPermission(
  accessControl: AccessControlService,
  permission: string
) {
  return async function (userId: string): Promise<boolean> {
    return accessControl.hasPermission(userId, permission);
  };
}

export function hasRole(
  accessControl: AccessControlService,
  roleName: string
) {
  return async function (userId: string): Promise<boolean> {
    const roles = await accessControl.getUserRoles(userId);
    return roles.some((r) => r.name === roleName);
  };
}
