import { FileMetadata } from "../types";

export interface MetadataStore {
    save(metadata: FileMetadata): Promise<void>;
    get(id: string): Promise<FileMetadata | null>;
    delete(id: string): Promise<void>;
}

export class MemoryMetadataStore implements MetadataStore {
    private store = new Map<string, FileMetadata>();

    async save(metadata: FileMetadata): Promise<void> {
        this.store.set(metadata.id, metadata);
        console.log(`[MemoryMetadataStore] Saved metadata for file ID: ${metadata.id}`);
    }

    async get(id: string): Promise<FileMetadata | null> {
        return this.store.get(id) || null;
    }

    async delete(id: string): Promise<void> {
        this.store.delete(id);
        console.log(`[MemoryMetadataStore] Deleted metadata for file ID: ${id}`);
    }
}
