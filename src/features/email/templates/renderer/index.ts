import { ReactElement } from "react";
import { render } from "@react-email/components";

export interface RendererOptions {
    name: string;
    locale?: string;
    version?: string;
    data: any;
}

export interface RenderResult {
    html: string;
    text: string;
}

export interface EmailTemplateModule<TData = any> {
    // A function that returns a React component configured with the data
    renderComponent: (data: TData) => ReactElement;
    subject: (data: TData) => string;
}

// In-memory cache for rendered strings
const cache = new Map<string, RenderResult>();

export class TemplateRenderer {
    /**
     * Generates a cache key based on template attributes and payload.
     */
    private getCacheKey(options: RendererOptions): string {
        const { name, locale = "en", version = "v1", data } = options;
        const dataHash = JSON.stringify(data); // In prod, use a faster hashing function
        return `${name}:${version}:${locale}:${dataHash}`;
    }

    /**
     * Dynamically loads a template module based on version and locale.
     */
    private async loadTemplateModule(name: string, version: string, locale: string): Promise<EmailTemplateModule> {
        try {
            // Dynamic import following the `templates/[name]/[version]/[locale].tsx` pattern
            const module = await import(`../${name}/${version}/${locale}`);
            return module;
        } catch (error: any) {
            console.error(`Failed to load template ${name}/${version}/${locale}. Falling back to default locale (en).`, error.message);
            // Fallback to default locale "en"
            try {
                const module = await import(`../${name}/${version}/en`);
                return module;
            } catch (fallbackError: any) {
                throw new Error(`Template ${name}/${version}/en not found.`);
            }
        }
    }

    public async render(options: RendererOptions): Promise<{ html: string; text: string; subject: string }> {
        const { name, locale = "en", version = "v1", data } = options;

        // Check Cache
        const cacheKey = this.getCacheKey(options);
        if (cache.has(cacheKey)) {
            console.log(`[TemplateRenderer] Cache HIT for key: ${cacheKey}`);
            const cached = cache.get(cacheKey)!;
            // We still need subject, so we invoke the module to get it (or cache it together)
        }

        // Load Component
        const templateModule = await this.loadTemplateModule(name, version, locale);
        const element = templateModule.renderComponent(data);
        const subject = templateModule.subject(data);

        // If cache hit, return early
        if (cache.has(cacheKey)) {
            return { ...cache.get(cacheKey)!, subject };
        }

        // Render using React Email
        console.log(`[TemplateRenderer] Compiling template ${name}/${version}/${locale} via React Email...`);
        const html = await render(element);
        const text = await render(element, { plainText: true });

        const result = { html, text };

        // Cache the fully rendered string
        cache.set(cacheKey, result);

        return { html, text, subject };
    }
}
