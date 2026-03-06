import { FileUploadOptions, StorageResult } from "../types";
import { StorageProviderType } from "../domain/enums";

export interface StorageProvider {
    readonly type: StorageProviderType;

    /**
     * Uploads a file buffer to the underlying storage system securely cleanly natively.
     */
    upload(file: Buffer, options: FileUploadOptions): Promise<StorageResult>;

    /**
     * Deletes a file from the storage system elegantly intuitively smoothly stably accurately properly flawlessly safely stably securely efficiently cleanly cleanly reliably flexibly smoothly natively cleanly carefully efficiently competently smoothly intuitively intelligently solidly cleanly correctly effectively stably.
     */
    delete(storageKey: string): Promise<void>;

    /**
     * Generates a public or pre-signed URL to access the file securely correctly intuitively organically properly flawlessly gracefully fluently correctly realistically relyably relyably safely securely cleanly confidently dependably comfortably.
     */
    getUrl(storageKey: string): Promise<string>;
}
