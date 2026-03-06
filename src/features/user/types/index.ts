import type { User, UserProfile, UserPreferences } from "../domain/models";
import type { UserRole, UserStatus } from "../domain/enums";

export type { User, UserProfile, UserPreferences };

export interface UserUpdatePayload {
    id: string;
    username?: string;
    role?: UserRole;
}

export interface ProfileUpdatePayload {
    userId: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
}

export interface PreferencesUpdatePayload {
    userId: string;
    theme?: "light" | "dark" | "system";
    language?: string;
    notificationsEnabled?: boolean;
    emailNotifications?: boolean;
    dashboardLayout?: "grid" | "list";
}

export interface UserSearchQuery {
    email?: string;
    username?: string;
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    pageSize?: number;
}

export interface PaginatedUsers {
    data: User[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
