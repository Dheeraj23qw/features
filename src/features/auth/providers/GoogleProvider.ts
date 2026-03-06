import type { OAuthProvider, UserProfile } from "./OAuthProvider";
import { OAuthProviderType } from "../domain/enums";
import { getAuthConfig } from "../utils/config";

export class GoogleProvider implements OAuthProvider {
    readonly type = OAuthProviderType.GOOGLE;
    private clientId: string;
    private clientSecret: string;
    private redirectUrl: string;

    constructor() {
        const config = getAuthConfig();
        this.clientId = config.OAUTH_GOOGLE_CLIENT_ID ?? "";
        this.clientSecret = config.OAUTH_GOOGLE_SECRET ?? "";
        this.redirectUrl = `${config.OAUTH_REDIRECT_BASE_URL ?? "http://localhost:3000"}/api/auth/callback/google`;
    }

    getAuthorizationUrl(state: string): string {
        const params = new URLSearchParams({
            client_id: this.clientId,
            redirect_uri: this.redirectUrl,
            response_type: "code",
            scope: "openid email profile",
            state,
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    async exchangeCode(code: string): Promise<UserProfile> {
        // In production: exchange code for token, then fetch userinfo from Google
        console.log(`[GoogleProvider] Exchanging OAuth code: ${code} (stub)`);
        return {
            id: `google-stub-${Date.now()}`,
            email: "stub@gmail.com",
            name: "Google Stub User",
            provider: OAuthProviderType.GOOGLE,
        };
    }
}
