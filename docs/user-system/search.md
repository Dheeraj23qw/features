# Search & Filtering

The `UserSearchService` provides filtered, paginated access to the user list.

## Query Parameters

```typescript
interface UserSearchQuery {
  email?: string;      // Partial match, case-insensitive
  username?: string;   // Partial match, case-insensitive
  role?: UserRole;     // Exact match
  status?: UserStatus; // Exact match
  page?: number;       // Default: 1
  pageSize?: number;   // Default: 20 (env: USER_LIST_DEFAULT_PAGE_SIZE)
}
```

## Response

```typescript
interface PaginatedUsers {
  data: User[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

## Example Usage

```typescript
import { listUsers, UserRole, UserStatus } from "@/features/user";

// Get page 2 of all ACTIVE admins matching "john"
const result = await listUsers({
  email: "john",
  role: UserRole.ADMIN,
  status: UserStatus.ACTIVE,
  page: 2,
  pageSize: 10,
});

console.log(`${result.total} users / ${result.totalPages} pages`);
```

## Future Extensions

The current implementation uses an in-memory scan (suitable for development and small datasets). The `UserSearchService` is designed to be replaced with:
- **Database queries** (Prisma `findMany` with filters)
- **Full-text search** (Elasticsearch, Meilisearch)

To switch, replace `MemoryUserStore` with a database-backed `UserStore` implementation.
