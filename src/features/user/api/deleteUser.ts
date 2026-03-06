import { UserManager } from "../services/UserManager";

export const deleteUser = (id: string, actorId?: string) =>
    UserManager.getInstance().deleteUser(id, actorId);
