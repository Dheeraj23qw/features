import { z } from "zod";

const userEnvSchema = z.object({
    USER_AVATAR_MAX_SIZE: z.coerce.number().default(2 * 1024 * 1024),  // 2MB
    USER_PROFILE_BIO_LIMIT: z.coerce.number().default(500),             // chars
    USER_USERNAME_MIN: z.coerce.number().default(3),
    USER_USERNAME_MAX: z.coerce.number().default(30),
    USER_LIST_DEFAULT_PAGE_SIZE: z.coerce.number().default(20),
});

export type UserConfig = z.infer<typeof userEnvSchema>;

export const getUserConfig = (): UserConfig => {
    const result = userEnvSchema.safeParse({
        USER_AVATAR_MAX_SIZE: process.env.USER_AVATAR_MAX_SIZE,
        USER_PROFILE_BIO_LIMIT: process.env.USER_PROFILE_BIO_LIMIT,
        USER_USERNAME_MIN: process.env.USER_USERNAME_MIN,
        USER_USERNAME_MAX: process.env.USER_USERNAME_MAX,
        USER_LIST_DEFAULT_PAGE_SIZE: process.env.USER_LIST_DEFAULT_PAGE_SIZE,
    });

    if (!result.success) {
        console.error("❌ Invalid User Module Configuration:", result.error.format());
        throw new Error("Invalid User Module Configuration.");
    }

    return result.data;
};
