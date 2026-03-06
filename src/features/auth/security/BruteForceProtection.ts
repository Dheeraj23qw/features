import { getAuthConfig } from "../utils/config";
import { AccountLockedError } from "../utils/errors";

interface AttemptRecord {
    count: number;
    lastAttempt: Date;
    lockedUntil?: Date;
}

export class BruteForceProtection {
    private attempts = new Map<string, AttemptRecord>();
    private readonly maxAttempts: number;
    private readonly lockoutMinutes: number;

    constructor() {
        const config = getAuthConfig();
        this.maxAttempts = config.MAX_LOGIN_ATTEMPTS;
        this.lockoutMinutes = config.LOCKOUT_DURATION_MINUTES;
    }

    /** Call before attempting login. Throws if account is locked. */
    check(identifier: string): void {
        const record = this.attempts.get(identifier);
        if (record?.lockedUntil && record.lockedUntil > new Date()) {
            const remaining = Math.ceil((record.lockedUntil.getTime() - Date.now()) / 60000);
            throw new AccountLockedError(remaining);
        }
    }

    /** Call on failed login. Increments counter and potentially locks account. */
    recordFailure(identifier: string): void {
        const now = new Date();
        const record = this.attempts.get(identifier) ?? { count: 0, lastAttempt: now };
        record.count += 1;
        record.lastAttempt = now;

        if (record.count >= this.maxAttempts) {
            const lockUntil = new Date(Date.now() + this.lockoutMinutes * 60 * 1000);
            record.lockedUntil = lockUntil;
            console.warn(`[BruteForce] Account locked: ${identifier} until ${lockUntil.toISOString()}`);
        }

        this.attempts.set(identifier, record);
    }

    /** Call on successful login. Clears history. */
    reset(identifier: string): void {
        this.attempts.delete(identifier);
    }
}
