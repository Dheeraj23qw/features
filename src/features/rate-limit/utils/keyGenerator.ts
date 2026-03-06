export const generateRateLimitKey = (
    type: "ip" | "user" | "api_key" | "custom",
    identifier: string,
    route?: string // Scoping the key generically
): string => {
    const base = `rl:${type}:${identifier}`;
    return route ? `${base}:${route}` : base;
};
