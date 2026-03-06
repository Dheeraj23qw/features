import { UserStatus, TokenType, MFAMethod } from "./enums";

export interface User {
    id: string;
    email: string;
    passwordHash?: string;         // Absent for OAuth-only users
    roles: string[];               // e.g. ["USER", "ADMIN"]
    status: UserStatus;
    isEmailVerified: boolean;
    mfaEnabled: boolean;
    mfaMethod?: MFAMethod;
    mfaSecret?: string;            // Encrypted TOTP secret
    oauthProviders: string[];      // e.g. ["GOOGLE"]
    createdAt: Date;
    updatedAt: Date;
}

export interface Session {
    id: string;
    userId: string;
    refreshToken: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
    expiresAt: Date;
    lastUsedAt: Date;
}

export interface StoredToken {
    id: string;
    userId: string;
    token: string;
    type: TokenType;
    expiresAt: Date;
    usedAt?: Date;
}
