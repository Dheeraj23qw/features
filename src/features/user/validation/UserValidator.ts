import { z } from "zod";
import { UserValidationError } from "../utils/errors";

// ── Lazy schema builders (avoids top-level config call during module load) ─
const getSchemas = () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getUserConfig } = require("../utils/config");
    const config = getUserConfig();

    const updateUserSchema = z.object({
        id: z.string().uuid("Invalid user ID."),
        username: z
            .string()
            .min(config.USER_USERNAME_MIN, `Username must be at least ${config.USER_USERNAME_MIN} characters.`)
            .max(config.USER_USERNAME_MAX, `Username must not exceed ${config.USER_USERNAME_MAX} characters.`)
            .regex(/^[a-zA-Z0-9_]+$/, "Username may only contain letters, numbers, and underscores.")
            .optional(),
        role: z.enum(["ADMIN", "MODERATOR", "USER"]).optional(),
    });

    const updateProfileSchema = z.object({
        userId: z.string().uuid("Invalid user ID."),
        firstName: z.string().max(50).optional(),
        lastName: z.string().max(50).optional(),
        bio: z.string().max(config.USER_PROFILE_BIO_LIMIT, `Bio must not exceed ${config.USER_PROFILE_BIO_LIMIT} characters.`).optional(),
        location: z.string().max(100).optional(),
        website: z.string().url("Invalid URL.").optional().or(z.literal("")),
        avatarUrl: z.string().url("Invalid avatar URL.").optional(),
    });

    const updatePreferencesSchema = z.object({
        userId: z.string().uuid("Invalid user ID."),
        theme: z.enum(["light", "dark", "system"]).optional(),
        language: z.string().min(2).max(10).optional(),
        notificationsEnabled: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
        dashboardLayout: z.enum(["grid", "list"]).optional(),
    });

    return { updateUserSchema, updateProfileSchema, updatePreferencesSchema };
};

export type UpdateUserInput = {
    id: string;
    username?: string;
    role?: "ADMIN" | "MODERATOR" | "USER";
};

export type UpdateProfileInput = {
    userId: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    location?: string;
    website?: string;
    avatarUrl?: string;
};

export type UpdatePreferencesInput = {
    userId: string;
    theme?: "light" | "dark" | "system";
    language?: string;
    notificationsEnabled?: boolean;
    emailNotifications?: boolean;
    dashboardLayout?: "grid" | "list";
};

// ── Validator Class ────────────────────────────────────────────────────────
export class UserValidator {
    validateUpdate(data: unknown): UpdateUserInput {
        const { updateUserSchema } = getSchemas();
        const result = updateUserSchema.safeParse(data);
        if (!result.success) {
            throw new UserValidationError(result.error.issues[0]?.message ?? "Validation failed.");
        }
        return result.data as UpdateUserInput;
    }

    validateProfile(data: unknown): UpdateProfileInput {
        const { updateProfileSchema } = getSchemas();
        const result = updateProfileSchema.safeParse(data);
        if (!result.success) {
            throw new UserValidationError(result.error.issues[0]?.message ?? "Validation failed.");
        }
        return result.data as UpdateProfileInput;
    }

    validatePreferences(data: unknown): UpdatePreferencesInput {
        const { updatePreferencesSchema } = getSchemas();
        const result = updatePreferencesSchema.safeParse(data);
        if (!result.success) {
            throw new UserValidationError(result.error.issues[0]?.message ?? "Validation failed.");
        }
        return result.data as UpdatePreferencesInput;
    }
}
