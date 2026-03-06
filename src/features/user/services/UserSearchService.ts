import type { UserStore } from "../stores/UserStore";
import type { User } from "../domain/models";
import type { UserRole, UserStatus } from "../domain/enums";
import type { UserSearchQuery, PaginatedUsers } from "../types/index";
import { getUserConfig } from "../utils/config";

export class UserSearchService {
    private defaultPageSize: number;

    constructor(private userStore: UserStore) {
        const config = getUserConfig();
        this.defaultPageSize = config.USER_LIST_DEFAULT_PAGE_SIZE;
    }

    async search(query: UserSearchQuery): Promise<PaginatedUsers> {
        const {
            email,
            username,
            role,
            status,
            page = 1,
            pageSize = this.defaultPageSize,
        } = query;

        let users = await this.userStore.findAll({ role, status });

        // Apply text filters
        if (email) {
            users = users.filter(u => u.email.toLowerCase().includes(email.toLowerCase()));
        }
        if (username) {
            users = users.filter(u => u.username?.toLowerCase().includes(username.toLowerCase()));
        }

        // Sort by newest first
        users.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        const total = users.length;
        const totalPages = Math.ceil(total / pageSize);
        const start = (page - 1) * pageSize;
        const data = users.slice(start, start + pageSize);

        return { data, total, page, pageSize, totalPages };
    }

    async listAll(filters?: { role?: UserRole; status?: UserStatus }): Promise<User[]> {
        return this.userStore.findAll(filters);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userStore.findByEmail(email);
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userStore.findByUsername(username);
    }
}
