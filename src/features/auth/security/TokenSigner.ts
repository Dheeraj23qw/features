import * as jwt from "jsonwebtoken";
import { getAuthConfig } from "../utils/config";
import type { AuthPayload } from "../types/index";
import { TokenExpiredError, TokenInvalidError } from "../utils/errors";

export class TokenSigner {
    private readonly secret: string;
    private readonly expiresIn: string;

    constructor() {
        const config = getAuthConfig();
        this.secret = config.JWT_SECRET;
        this.expiresIn = config.JWT_EXPIRES_IN;
    }

    sign(payload: Omit<AuthPayload, "iat" | "exp">): string {
        return jwt.sign(payload, this.secret, { expiresIn: this.expiresIn as any });
    }

    verify(token: string): AuthPayload {
        try {
            return jwt.verify(token, this.secret) as AuthPayload;
        } catch (err: any) {
            if (err?.name === "TokenExpiredError") throw new TokenExpiredError();
            throw new TokenInvalidError();
        }
    }

    decode(token: string): AuthPayload | null {
        try {
            return jwt.decode(token) as AuthPayload;
        } catch {
            return null;
        }
    }
}
