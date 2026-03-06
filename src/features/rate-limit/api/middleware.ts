import { NextResponse } from "next/server";
import { rateLimitService } from "../services/RateLimitService";
import { RateLimitConfig } from "../types";
import { RateLimitExceededError } from "../utils/errors";

export interface RateLimitMiddlewareConfig extends Partial<RateLimitConfig> {
    key: string;
    skipIf?: (request: Request) => boolean | Promise<boolean>;
    onRateLimitExceeded?: (request: Request, error: RateLimitExceededError) => Response | Promise<Response>;
}

/**
 * High order middleware factory for Next.js App Router API Routes.
 */
export const rateLimit = (config: RateLimitMiddlewareConfig) => {
    return async (request: Request, next: () => Promise<NextResponse>) => {
        try {
            const result = await rateLimitService.checkLimit({
                key: config.key,
                config,
                skipIf: config.skipIf ? () => config.skipIf!(request) : undefined,
            });

            if (!result.allowed) {
                const resetSeconds = Math.ceil((result.resetTime - Date.now()) / 1000);

                const error = new RateLimitExceededError(
                    "Rate limit exceeded.",
                    result.remaining,
                    result.resetTime
                );

                if (config.onRateLimitExceeded) {
                    return config.onRateLimitExceeded(request, error);
                }

                return new NextResponse(
                    JSON.stringify({ error: "Too Many Requests", retryAfter: resetSeconds }),
                    {
                        status: 429,
                        headers: {
                            "X-RateLimit-Limit": String(result.limit),
                            "X-RateLimit-Remaining": String(result.remaining),
                            "X-RateLimit-Reset": String(result.resetTime),
                            "Retry-After": String(resetSeconds),
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            // If allowed, we proceed to actual route handler but inject standard headers safely into the response.
            // Easiest mechanism in App Router is to let 'next' resolve, clone/modify its headers.
            const response = await next();

            response.headers.set("X-RateLimit-Limit", String(result.limit));
            response.headers.set("X-RateLimit-Remaining", String(result.remaining));
            response.headers.set("X-RateLimit-Reset", String(result.resetTime));

            return response;

        } catch (e: any) {
            console.error(`🚨 [RateLimitMiddleware] Fallback: Safe failure occurred. Proceeding without limits. Err: ${e.message}`);
            // Safety fail-open protocol: do not break APIs if Redis drops connection dynamically
            return next();
        }
    };
};
