import { UserManager } from "../services/UserManager";

export const getUser = (id: string) => UserManager.getInstance().getUser(id);
