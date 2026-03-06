import { z } from "zod";

const rateLimitEnvSchema = z.object({
    RATE_LIMIT_STORE: z.enum(["memory", "redis"]).default("memory"),
    RATE_LIMIT_DEFAULT_LIMIT: z.coerce.number().default(100),
    RATE_LIMIT_DEFAULT_WINDOW: z.coerce.number().default(60),
    RATE_LIMIT_DEFAULT_STRATEGY: z.enum(["fixed", "sliding", "token"]).default("sliding"),
});

export type RateLimitGlobalConfig = z.infer<typeof rateLimitEnvSchema>;

export const getRateLimitConfig = (): RateLimitGlobalConfig => {
    const parsed = rateLimitEnvSchema.safeParse({
        RATE_LIMIT_STORE: process.env.RATE_LIMIT_STORE,
        RATE_LIMIT_DEFAULT_LIMIT: process.env.RATE_LIMIT_DEFAULT_LIMIT,
        RATE_LIMIT_DEFAULT_WINDOW: process.env.RATE_LIMIT_DEFAULT_WINDOW,
        RATE_LIMIT_DEFAULT_STRATEGY: process.env.RATE_LIMIT_DEFAULT_STRATEGY,
    });

    if (!parsed.success) {
        console.error("❌ Invalid Rate Limit Configuration:", parsed.error.format());
        throw new Error("Invalid Rate Limit Configuration");
    }

    return parsed.data;
};
