import { FileStatus, StorageProviderType, FileVisibility } from "./enums";

export interface FileObject {
    id: string;               // Unique ID
    filename: string;         // Original filename
    mimeType: string;
    size: number;
    checksum: string;         // e.g. SHA-256
    storageKey: string;       // Path/Key in the storage bucket/system
    url?: string;             // Public or pre-signed URL
    visibility: FileVisibility;
    status: FileStatus;
    provider: StorageProviderType;
    uploadedAt: Date;
    metadata?: Record<string, any>; // EXIF, image dimensions, custom tags
}
