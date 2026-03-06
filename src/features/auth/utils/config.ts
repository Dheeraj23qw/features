import { z } from "zod";

const authEnvSchema = z.object({
    JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
    JWT_EXPIRES_IN: z.string().default("15m"),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default("7d"),
    REFRESH_TOKEN_EXPIRES_DAYS: z.coerce.number().default(7),

    // Email Verification / Password Reset
    EMAIL_TOKEN_EXPIRES_MINUTES: z.coerce.number().default(60),

    // OAuth
    OAUTH_GOOGLE_CLIENT_ID: z.string().optional(),
    OAUTH_GOOGLE_SECRET: z.string().optional(),
    OAUTH_GITHUB_CLIENT_ID: z.string().optional(),
    OAUTH_GITHUB_SECRET: z.string().optional(),
    OAUTH_REDIRECT_BASE_URL: z.string().url().optional(),

    // Brute Force
    MAX_LOGIN_ATTEMPTS: z.coerce.number().default(5),
    LOCKOUT_DURATION_MINUTES: z.coerce.number().default(15),

    // MFA
    MFA_ISSUER: z.string().default("EnterpriseApp"),
});

export type AuthConfig = z.infer<typeof authEnvSchema>;

export const getAuthConfig = (): AuthConfig => {
    const result = authEnvSchema.safeParse({
        JWT_SECRET: process.env.JWT_SECRET,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
        REFRESH_TOKEN_EXPIRES_DAYS: process.env.REFRESH_TOKEN_EXPIRES_DAYS,
        EMAIL_TOKEN_EXPIRES_MINUTES: process.env.EMAIL_TOKEN_EXPIRES_MINUTES,
        OAUTH_GOOGLE_CLIENT_ID: process.env.OAUTH_GOOGLE_CLIENT_ID,
        OAUTH_GOOGLE_SECRET: process.env.OAUTH_GOOGLE_SECRET,
        OAUTH_GITHUB_CLIENT_ID: process.env.OAUTH_GITHUB_CLIENT_ID,
        OAUTH_GITHUB_SECRET: process.env.OAUTH_GITHUB_SECRET,
        OAUTH_REDIRECT_BASE_URL: process.env.OAUTH_REDIRECT_BASE_URL,
        MAX_LOGIN_ATTEMPTS: process.env.MAX_LOGIN_ATTEMPTS,
        LOCKOUT_DURATION_MINUTES: process.env.LOCKOUT_DURATION_MINUTES,
        MFA_ISSUER: process.env.MFA_ISSUER,
    });

    if (!result.success) {
        console.error("❌ Invalid Auth Configuration:", result.error.format());
        throw new Error("Invalid Auth Configuration. Check environment variables.");
    }

    return result.data;
};
