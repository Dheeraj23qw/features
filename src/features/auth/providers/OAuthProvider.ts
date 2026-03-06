export interface UserProfile {
    id: string;           // Provider-side user ID
    email: string;
    name?: string;
    avatarUrl?: string;
    provider: string;
}

export interface OAuthProvider {
    readonly type: string;
    getAuthorizationUrl(state: string): string;
    exchangeCode(code: string): Promise<UserProfile>;
}
