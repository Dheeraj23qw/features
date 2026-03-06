import type { OAuthProvider } from "../providers/OAuthProvider";

export class OAuthStrategy {
    private providers = new Map<string, OAuthProvider>();

    register(provider: OAuthProvider): void {
        this.providers.set(provider.type, provider);
    }

    getProvider(type: string): OAuthProvider {
        const provider = this.providers.get(type);
        if (!provider) throw new Error(`OAuth provider '${type}' is not registered.`);
        return provider;
    }
}
