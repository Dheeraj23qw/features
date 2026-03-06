import { randomInt } from "crypto";
import { MFAMethod } from "../domain/enums";
import { getAuthConfig } from "../utils/config";

export class MFAService {
    private readonly issuer: string;
    // In-memory code store for email OTP stubs
    private codes = new Map<string, { code: string; expiresAt: Date }>();

    constructor() {
        const config = getAuthConfig();
        this.issuer = config.MFA_ISSUER;
    }

    /**
     * Generate a TOTP-compatible secret (stub — use `otplib` in production).
     */
    generateTOTPSecret(): string {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let secret = "";
        for (let i = 0; i < 32; i++) secret += chars[randomInt(chars.length)];
        return secret;
    }

    /**
     * Generate TOTP URI for QR code.
     */
    getTOTPUri(email: string, secret: string): string {
        return `otpauth://totp/${encodeURIComponent(this.issuer)}:${encodeURIComponent(email)}?secret=${secret}&issuer=${encodeURIComponent(this.issuer)}`;
    }

    /**
     * Verify a TOTP code (stub — delegates to otplib in production).
     */
    verifyTOTP(_secret: string, code: string): boolean {
        // TODO: Replace with `totp.verify({ token: code, secret })` from otplib
        console.log(`[MFAService] Verifying TOTP code: ${code} (stub — always passes in dev)`);
        return code.length === 6 && /^\d+$/.test(code);
    }

    /**
     * Generate a 6-digit email OTP and store it temporarily.
     */
    generateEmailCode(userId: string): string {
        const code = String(randomInt(100000, 999999));
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        this.codes.set(userId, { code, expiresAt });
        return code;
    }

    /**
     * Verify the email OTP code.
     */
    verifyEmailCode(userId: string, code: string): boolean {
        const stored = this.codes.get(userId);
        if (!stored) return false;
        if (stored.expiresAt < new Date()) {
            this.codes.delete(userId);
            return false;
        }
        if (stored.code === code) {
            this.codes.delete(userId);
            return true;
        }
        return false;
    }
}
