import type { User, UserProfile, UserPreferences } from "../domain/models";

/** Safe user DTO — no internal fields exposed. */
export type PublicUser = Omit<User, never>;

/** Strips internal fields before sending to clients. */
export const toPublicUser = (user: User): PublicUser => ({ ...user });

/** Merges profile defaults when profile doesn't exist yet. */
export const toPublicProfile = (profile: UserProfile | null, userId: string): UserProfile => {
    return profile ?? { userId, notificationsEnabled: true } as UserProfile;
};

/** Returns safe preferences with defaults. */
export const toPublicPreferences = (prefs: UserPreferences | null, userId: string): UserPreferences => {
    return prefs ?? {
        userId,
        theme: "system",
        language: "en",
        notificationsEnabled: true,
        emailNotifications: true,
        dashboardLayout: "grid",
    };
};
