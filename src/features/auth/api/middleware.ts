import { JWTStrategy } from "../strategies/JWTStrategy";
import { hasPermission, type Permission } from "../domain/permissions";
import { PermissionDeniedError, TokenInvalidError } from "../utils/errors";
import type { AuthPayload } from "../types/index";
import type { NextRequest } from "next/server";

const jwtStrategy = new JWTStrategy();

/**
 * Extracts and validates the JWT from the Authorization header.
 * Returns the decoded AuthPayload or throws.
 */
export const requireAuth = (req: NextRequest): AuthPayload => {
    const authHeader = req.headers.get("authorization") ?? undefined;
    try {
        return jwtStrategy.extractFromHeader(authHeader);
    } catch {
        throw new TokenInvalidError();
    }
};

/**
 * Checks that the authenticated user has the required permission.
 * Call requireAuth first to obtain AuthPayload.
 */
export const requirePermission = (payload: AuthPayload, permission: Permission): void => {
    if (!hasPermission(payload.roles, permission)) {
        throw new PermissionDeniedError();
    }
};

/**
 * Checks that the authenticated user has at least one of the given roles.
 */
export const requireRole = (payload: AuthPayload, ...roles: string[]): void => {
    const hasRole = payload.roles.some(r => roles.includes(r));
    if (!hasRole) throw new PermissionDeniedError();
};
