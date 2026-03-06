import { UserManager } from "../services/UserManager";
import type { PreferencesUpdatePayload } from "../types/index";

export const getPreferences = (userId: string) =>
    UserManager.getInstance().getPreferences(userId);

export const updatePreferences = (payload: PreferencesUpdatePayload, actorId?: string) =>
    UserManager.getInstance().updatePreferences(payload, actorId);
