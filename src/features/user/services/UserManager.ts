import { MemoryUserStore } from "../stores/UserStore";
import { MemoryProfileStore } from "../stores/ProfileStore";
import { MemoryPreferenceStore } from "../stores/PreferenceStore";
import { UserService } from "./UserService";
import { ProfileService } from "./ProfileService";
import { UserSearchService } from "./UserSearchService";
import { UserLifecycleService } from "./UserLifecycleService";
import { UserValidator } from "../validation/UserValidator";
import { UserEvents } from "../events/UserEvents";
import type { UserPreferences } from "../domain/models";
import type {
    UserUpdatePayload,
    ProfileUpdatePayload,
    PreferencesUpdatePayload,
    UserSearchQuery,
    PaginatedUsers,
    User,
    UserProfile,
} from "../types/index";
import type { UserRole } from "../domain/enums";
import { toPublicPreferences } from "../utils/mappers";

/**
 * UserManager is the central singleton orchestrating all user management
 * operations. It wires together all stores, services, and validators.
 */
export class UserManager {
    private static instance: UserManager;

    private userStore = new MemoryUserStore();
    private profileStore = new MemoryProfileStore();
    private preferenceStore = new MemoryPreferenceStore();
    private validator = new UserValidator();

    public readonly users: UserService;
    public readonly profiles: ProfileService;
    public readonly search: UserSearchService;
    public readonly lifecycle: UserLifecycleService;

    private constructor() {
        this.users = new UserService(this.userStore);
        this.profiles = new ProfileService(this.profileStore);
        this.search = new UserSearchService(this.userStore);
        this.lifecycle = new UserLifecycleService(this.userStore);
    }

    public static getInstance(): UserManager {
        if (!UserManager.instance) UserManager.instance = new UserManager();
        return UserManager.instance;
    }

    // ── User CRUD ──────────────────────────────────────────────────────────
    async getUser(id: string): Promise<User> {
        return this.users.getUserById(id);
    }

    async updateUser(payload: UserUpdatePayload, actorId?: string): Promise<User> {
        const validated = this.validator.validateUpdate(payload);
        return this.users.updateUser(validated as UserUpdatePayload, actorId);
    }

    async deleteUser(id: string, actorId?: string): Promise<void> {
        return this.users.deleteUser(id, actorId);
    }

    async updateRole(userId: string, role: UserRole, actorId?: string): Promise<User> {
        return this.users.updateRole(userId, role, actorId);
    }

    // ── Profile ────────────────────────────────────────────────────────────
    async getProfile(userId: string): Promise<UserProfile> {
        return this.profiles.getProfile(userId);
    }

    async updateProfile(payload: ProfileUpdatePayload, actorId?: string): Promise<UserProfile> {
        const validated = this.validator.validateProfile(payload);
        return this.profiles.updateProfile(validated as ProfileUpdatePayload, actorId);
    }

    // ── Preferences ────────────────────────────────────────────────────────
    async getPreferences(userId: string): Promise<UserPreferences> {
        const prefs = await this.preferenceStore.findByUserId(userId);
        return toPublicPreferences(prefs, userId);
    }

    async updatePreferences(
        payload: PreferencesUpdatePayload,
        actorId?: string
    ): Promise<UserPreferences> {
        const validated = this.validator.validatePreferences(payload);
        const { userId, ...fields } = validated;
        const existing = await this.preferenceStore.findByUserId(userId);
        const saved = await this.preferenceStore.upsert({
            userId,
            notificationsEnabled: true,
            emailNotifications: true,
            ...existing,
            ...fields,
        });
        UserEvents.emitEvent("user.preferences_updated", { userId, changes: Object.keys(fields), actorId });
        return saved;
    }

    // ── Search & Listing ───────────────────────────────────────────────────
    async listUsers(query: UserSearchQuery): Promise<PaginatedUsers> {
        return this.search.search(query);
    }
}
