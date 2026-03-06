import { z } from "zod";
import { StorageProviderType } from "../domain/enums";

const storageEnvSchema = z.object({
    STORAGE_PROVIDER: z.nativeEnum(StorageProviderType).default(StorageProviderType.LOCAL),
    STORAGE_LOCAL_ROOT: z.string().default("./uploads"),

    // AWS S3
    S3_BUCKET_NAME: z.string().optional(),
    S3_REGION: z.string().optional(),

    // Cloudflare R2
    R2_BUCKET_NAME: z.string().optional(),
    R2_ACCOUNT_ID: z.string().optional(),

    MAX_UPLOAD_SIZE: z.coerce.number().default(10 * 1024 * 1024), // 10MB default
    ALLOWED_IMAGE_MIMES: z.string().default("image/jpeg,image/png,image/webp,image/gif"),
    ALLOWED_DOCUMENT_MIMES: z.string().default("application/pdf,text/plain"),
});

export type StorageGlobalConfig = z.infer<typeof storageEnvSchema>;

export const getStorageConfig = (): StorageGlobalConfig => {
    const parsed = storageEnvSchema.safeParse({
        STORAGE_PROVIDER: process.env.STORAGE_PROVIDER,
        STORAGE_LOCAL_ROOT: process.env.STORAGE_LOCAL_ROOT,
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
        S3_REGION: process.env.S3_REGION,
        R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
        R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
        MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE,
        ALLOWED_IMAGE_MIMES: process.env.ALLOWED_IMAGE_MIMES,
        ALLOWED_DOCUMENT_MIMES: process.env.ALLOWED_DOCUMENT_MIMES,
    });

    if (!parsed.success) {
        console.error("❌ Invalid Storage Configuration:", parsed.error.format());
        throw new Error("Invalid Storage Configuration");
    }

    return parsed.data;
};
