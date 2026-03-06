import { EmailMessage, EmailResult } from "../../domain/models";

/**
 * Base interface that all email providers must implement.
 */
export interface EmailProvider {
    name: string;
    send(message: EmailMessage): Promise<EmailResult>;
}

export class ProviderRegistry {
    private providers: Map<string, EmailProvider> = new Map();
    private primaryProviderName?: string;
    private fallbackChain: string[] = [];

    /**
     * Register a new email provider in the system.
     */
    public register(provider: EmailProvider, isPrimary = false) {
        this.providers.set(provider.name, provider);
        if (isPrimary) {
            this.primaryProviderName = provider.name;
        }
    }

    /**
     * Set the fallback progression (e.g., ["resend", "sendgrid", "ses"]).
     */
    public setFallbackChain(chain: string[]) {
        this.fallbackChain = chain;
        if (chain.length > 0 && !this.primaryProviderName) {
            this.primaryProviderName = chain[0];
        }
    }

    public getProvider(name: string): EmailProvider | undefined {
        return this.providers.get(name);
    }

    public getPrimaryProvider(): EmailProvider {
        if (!this.primaryProviderName || !this.providers.has(this.primaryProviderName)) {
            throw new Error("No primary email provider registered.");
        }
        return this.providers.get(this.primaryProviderName)!;
    }

    /**
     * Resolves the next provider in the chain if the current one fails.
     */
    public getNextFallback(failedProviderName: string): EmailProvider | undefined {
        const currentIndex = this.fallbackChain.indexOf(failedProviderName);
        if (currentIndex === -1 || currentIndex >= this.fallbackChain.length - 1) {
            return undefined; // No more fallbacks
        }
        const nextName = this.fallbackChain[currentIndex + 1];
        return this.providers.get(nextName);
    }
}

// Export singleton instance of the registry
export const providerRegistry = new ProviderRegistry();
