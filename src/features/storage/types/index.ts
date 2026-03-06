import { FileObject } from "../domain/models";
import { FileVisibility } from "../domain/enums";

export type { FileObject };

export interface FileUploadOptions {
    filename: string;
    mimeType: string;
    visibility?: FileVisibility;   // Default to PRIVATE usually
    folder?: string;               // Optional sub-folder prefix (e.g. 'avatars')
    metadata?: Record<string, any>;
    replaceId?: string;            // If overwriting an existing logical file
}

export interface StorageResult {
    storageKey: string;
    url?: string;
}

export interface FileMetadata extends Omit<FileObject, "checksum" | "status"> {
    // Stored in the MetadataStore
}
