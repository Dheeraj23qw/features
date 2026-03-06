import { randomUUID } from "crypto";
import * as path from "path";

/**
 * Generates a safe storage key avoiding path traversal and ensuring uniqueness.
 */
export const buildStorageKey = (filename: string, folder?: string): string => {
    const ext = path.extname(filename).toLowerCase();

    // Sanitize filename: remove special characters, spaces, and path segments
    let safeName = path.basename(filename, ext)
        .replace(/[^a-zA-Z0-9-_\.]/g, "")
        .replace(/\s+/g, "-");

    if (safeName.length === 0) {
        safeName = "file";
    }

    const uniqueId = randomUUID().replace(/-/g, "").substring(0, 12);
    const finalFilename = `${safeName}-${uniqueId}${ext}`;

    if (folder) {
        // Sanitize folder
        const safeFolder = folder.replace(/[^a-zA-Z0-9-_\/]/g, "").replace(/^\/+|\/+$/g, "");
        return `${safeFolder}/${finalFilename}`;
    }

    return finalFilename;
};
