import type { User, Session } from "../domain/models";
import type { Permission } from "../domain/permissions";

export type { User, Session };

export interface AuthPayload {
    userId: string;
    email: string;
    roles: string[];
    permissions: Permission[];
    iat?: number;
    exp?: number;
}

export interface AuthResult {
    accessToken: string;
    refreshToken: string;
    user: Omit<User, "passwordHash" | "mfaSecret">;
    requiresMFA?: boolean;    // True if MFA step needed
    mfaToken?: string;        // Temporary token for MFA step
}

export interface UserSession extends Omit<Session, "refreshToken"> {
    // Exposed session data (never exposes refresh tokens publicly)
}
