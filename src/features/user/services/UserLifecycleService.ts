import type { UserStore } from "../stores/UserStore";
import type { User } from "../domain/models";
import { UserStatus } from "../domain/enums";
import { UserEvents } from "../events/UserEvents";
import {
    UserNotFoundError,
    UserDeletedError,
    InvalidStatusTransitionError,
} from "../utils/errors";

// Allowed transitions: { from: [to, to, ...] }
const ALLOWED_TRANSITIONS: Record<UserStatus, UserStatus[]> = {
    [UserStatus.ACTIVE]: [UserStatus.INACTIVE, UserStatus.SUSPENDED, UserStatus.DELETED],
    [UserStatus.INACTIVE]: [UserStatus.ACTIVE, UserStatus.DELETED],
    [UserStatus.SUSPENDED]: [UserStatus.ACTIVE, UserStatus.DELETED],
    [UserStatus.DELETED]: [],
};

export class UserLifecycleService {
    constructor(private userStore: UserStore) { }

    private async transition(userId: string, to: UserStatus, actorId?: string): Promise<User> {
        const user = await this.userStore.findById(userId);
        if (!user) throw new UserNotFoundError(userId);
        if (user.status === UserStatus.DELETED) throw new UserDeletedError();

        const allowed = ALLOWED_TRANSITIONS[user.status];
        if (!allowed.includes(to)) {
            throw new InvalidStatusTransitionError(user.status, to);
        }

        const updated = await this.userStore.update(userId, { status: to });

        const eventMap: Partial<Record<UserStatus, "user.activated" | "user.suspended" | "user.deleted">> = {
            [UserStatus.ACTIVE]: "user.activated",
            [UserStatus.SUSPENDED]: "user.suspended",
            [UserStatus.DELETED]: "user.deleted",
        };
        const event = eventMap[to];
        if (event) UserEvents.emitEvent(event, { userId, actorId });

        return updated;
    }

    async activate(userId: string, actorId?: string) { return this.transition(userId, UserStatus.ACTIVE, actorId); }
    async deactivate(userId: string, actorId?: string) { return this.transition(userId, UserStatus.INACTIVE, actorId); }
    async suspend(userId: string, actorId?: string) { return this.transition(userId, UserStatus.SUSPENDED, actorId); }
    async softDelete(userId: string, actorId?: string) { return this.transition(userId, UserStatus.DELETED, actorId); }
}
