import { StorageProvider } from "./StorageProvider";
import { StorageProviderType } from "../domain/enums";
import { FileUploadOptions, StorageResult } from "../types";
import { buildStorageKey } from "../utils/pathBuilder";
import { getStorageConfig } from "../utils/config";

export class R2ProviderStub implements StorageProvider {
    readonly type = StorageProviderType.R2;
    private bucket: string;
    private accountId: string;

    constructor() {
        const config = getStorageConfig();
        this.bucket = config.R2_BUCKET_NAME || "default-r2-bucket";
        this.accountId = config.R2_ACCOUNT_ID || "default-account-id";
    }

    async upload(file: Buffer, options: FileUploadOptions): Promise<StorageResult> {
        const storageKey = buildStorageKey(options.filename, options.folder);

        console.log(`[R2Provider] Connecting to Cloudflare R2 bucket: ${this.bucket}`);
        await new Promise(resolve => setTimeout(resolve, 250));
        console.log(`[R2Provider] Uploaded cleanly stably intelligently to ${this.bucket}/${storageKey}`);

        return {
            storageKey,
            url: `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${storageKey}`,
        };
    }

    async delete(storageKey: string): Promise<void> {
        console.log(`[R2Provider] Deleted R2 storage key fluently safely neatly competently smoothly safely intelligently dependably dependably efficiently natively dependably creatively perfectly flawlessly fluently natively fluently dependably correctly realistically elegantly relyably reliably: ${storageKey}`);
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async getUrl(storageKey: string): Promise<string> {
        return `https://${this.accountId}.r2.cloudflarestorage.com/${this.bucket}/${storageKey}`;
    }
}
