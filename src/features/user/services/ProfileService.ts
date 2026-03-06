import type { ProfileStore } from "../stores/ProfileStore";
import type { UserProfile } from "../domain/models";
import type { ProfileUpdatePayload } from "../types/index";
import { UserEvents } from "../events/UserEvents";
import { toPublicProfile } from "../utils/mappers";

export class ProfileService {
    constructor(private profileStore: ProfileStore) { }

    async getProfile(userId: string): Promise<UserProfile> {
        const profile = await this.profileStore.findByUserId(userId);
        return toPublicProfile(profile, userId);
    }

    async updateProfile(payload: ProfileUpdatePayload, actorId?: string): Promise<UserProfile> {
        const { userId, ...fields } = payload;
        const existing = await this.profileStore.findByUserId(userId);

        const updated = await this.profileStore.upsert({
            userId,
            ...existing,
            ...fields,
        });

        UserEvents.emitEvent("user.profile_updated", {
            userId,
            changes: Object.keys(fields),
            actorId,
        });

        return updated;
    }

    /**
     * Integration hook for the Storage Feature Module.
     * Pass a pre-signed or public URL from the storage module to set as avatar.
     */
    async updateAvatar(userId: string, avatarUrl: string): Promise<UserProfile> {
        return this.updateProfile({ userId, avatarUrl });
    }
}
