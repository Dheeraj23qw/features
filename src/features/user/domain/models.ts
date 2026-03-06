import { UserRole, UserStatus } from "./enums";

export interface User {
    id: string;
    email: string;
    username?: string;
    role: UserRole;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserProfile {
    userId: string;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    website?: string;
}

export interface UserPreferences {
    userId: string;
    theme?: "light" | "dark" | "system";
    language?: string;
    notificationsEnabled: boolean;
    emailNotifications: boolean;
    dashboardLayout?: "grid" | "list";
}
