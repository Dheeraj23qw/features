import { UserManager } from "../services/UserManager";
import type { UserSearchQuery } from "../types/index";

export const listUsers = (query: UserSearchQuery = {}) =>
    UserManager.getInstance().listUsers(query);
