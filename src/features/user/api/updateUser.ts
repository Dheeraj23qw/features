import { UserManager } from "../services/UserManager";
import type { UserUpdatePayload, ProfileUpdatePayload } from "../types/index";

export const updateUser = (payload: UserUpdatePayload, actorId?: string) =>
    UserManager.getInstance().updateUser(payload, actorId);

export const updateProfile = (payload: ProfileUpdatePayload, actorId?: string) =>
    UserManager.getInstance().updateProfile(payload, actorId);
