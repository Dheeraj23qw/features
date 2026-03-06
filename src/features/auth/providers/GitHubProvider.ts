import type { OAuthProvider, UserProfile } from "./OAuthProvider";
import { OAuthProviderType } from "../domain/enums";
import { getAuthConfig } from "../utils/config";

export class GitHubProvider implements OAuthProvider {
    readonly type = OAuthProviderType.GITHUB;
    private clientId: string;
    private redirectUrl: string;

    constructor() {
        const config = getAuthConfig();
        this.clientId = config.OAUTH_GITHUB_CLIENT_ID ?? "";
        this.redirectUrl = `${config.OAUTH_REDIRECT_BASE_URL ?? "http://localhost:3000"}/api/auth/callback/github`;
    }

    getAuthorizationUrl(state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUrl,
            scope: "user:email",
            state,
        });
        return `https://github.com/login/oauth/authorize?${params.toString()}`;
    }

    async exchangeCode(code: string): Promise<UserProfile> {
        // In production: POST to https://github.com/login/oauth/access_token, then GET /user
        console.log(`[GitHubProvider] Exchanging OAuth code: ${code} (stub)`);
        return {
            id: `github-stub-${Date.now()}`,
            email: "stub@github.com",
            name: "GitHub Stub User",
            provider: OAuthProviderType.GITHUB,
        };
    }
}
