import type { UserStore } from "../stores/UserStore";
import type { User } from "../domain/models";
import type { UserRole } from "../domain/enums";
import { UserStatus } from "../domain/enums";
import type { UserUpdatePayload } from "../types/index";
import { UserEvents } from "../events/UserEvents";
import { UserNotFoundError, UserDeletedError } from "../utils/errors";

export class UserService {
    constructor(private userStore: UserStore) { }

    async getUserById(id: string): Promise<User> {
        const user = await this.userStore.findById(id);
        if (!user) throw new UserNotFoundError(id);
        if (user.status === UserStatus.DELETED) throw new UserDeletedError();
        return user;
    }

    async getUserByEmail(email: string): Promise<User> {
        const user = await this.userStore.findByEmail(email);
        if (!user) throw new UserNotFoundError();
        return user;
    }

    async updateUser(payload: UserUpdatePayload, actorId?: string): Promise<User> {
        const { id, ...data } = payload;
        await this.getUserById(id); // Ensures exists & not deleted

        const user = await this.userStore.update(id, data);

        UserEvents.emitEvent("user.updated", {
            userId: id,
            changes: Object.keys(data),
            actorId,
        });

        return user;
    }

    async updateRole(userId: string, role: UserRole, actorId?: string): Promise<User> {
        await this.getUserById(userId);
        const user = await this.userStore.update(userId, { role });

        UserEvents.emitEvent("user.role_changed", { userId, changes: ["role"], actorId });

        return user;
    }

    async deleteUser(userId: string, actorId?: string): Promise<void> {
        await this.getUserById(userId);
        await this.userStore.softDelete(userId);

        UserEvents.emitEvent("user.deleted", { userId, actorId });
    }
}
