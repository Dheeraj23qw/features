import { AccessControlService } from "./services/access.service";
import { RoleService } from "./services/role.service";
import { PermissionService } from "./services/permission.service";
import { MemoryAccessStore } from "./stores/memory.store";
import { createAuthorizeMiddleware } from "./api/middleware";

const defaultStore = new MemoryAccessStore();

export const accessControl = new AccessControlService({
  store: defaultStore,
});

export const roleService = new RoleService(defaultStore);
export const permissionService = new PermissionService(defaultStore);

export { createAuthorizeMiddleware as authorize };

export { AccessControlService } from "./services/access.service";
export { RoleService } from "./services/role.service";
export { PermissionService } from "./services/permission.service";
export { MemoryAccessStore } from "./stores/memory.store";

export type { AccessStore } from "./stores/access.store";
export type { DatabaseAccessStoreOptions, DatabaseClient } from "./stores/database.store";

export type {
  Role,
  Permission,
  UserRole,
  RoleInput,
  PermissionInput,
  AccessContext,
  ResourceContext,
} from "./domain/models";

export { parsePermission, matchesPermission, hasWildcardPermission } from "./domain/models";

export { DEFAULT_PERMISSIONS, ADMIN_PERMISSIONS, SYSTEM_ROLES } from "./domain/permissions";

export { PolicyEngine, policyEngine } from "./policies/policy.engine";
export type { Policy, PolicyContext, PolicyEvaluator } from "./policies/policy.types";

export {
  AuthorizationError,
  RoleNotFoundError,
  RoleAlreadyExistsError,
  CannotModifySystemRoleError,
  PermissionDeniedError,
  InvalidPermissionError,
} from "./utils/errors";

export {
  ACCESS_CONTROL_CONFIG,
  isValidPermissionFormat,
  isWildcardPermission,
  getPermissionParts,
} from "./utils/constants";
