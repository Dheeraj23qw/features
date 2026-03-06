# Storage Providers

The module utilizes an Adapter Pattern for its storage backends via the `StorageProvider` interface.

## Provider Interface

Every provider must implement:
1. `upload(file: Buffer, options: FileUploadOptions): Promise<StorageResult>`
2. `delete(storageKey: string): Promise<void>`
3. `getUrl(storageKey: string): Promise<string>`

## Supported Providers

### 1. LocalProvider
Saves files securely to the local disk. Excellent for development or small monolithic deployments. It automatically ensures directories exist before writing.
- **Config**: Relies on `STORAGE_LOCAL_ROOT` (default: `./uploads`).

### 2. S3Provider (Amazon S3)
Uploads buffers to an AWS S3 Bucket. Retrieves pre-signed URLs for secure private access.
- **Config**: Relies on `S3_BUCKET_NAME` and `S3_REGION`.

### 3. R2Provider (Cloudflare R2)
Uploads buffers to a Cloudflare R2 bucket. Often used for its zero-egress fee cost structure and built-in CDN integration.
- **Config**: Relies on `R2_BUCKET_NAME` and `R2_ACCOUNT_ID`.

## Adding a New Provider (e.g., Azure Blob Storage)

1. Create `AzureProvider.ts` in `providers/`.
2. Implement the `StorageProvider` interface.
3. Update `StorageService.ts` to instantiate `AzureProvider` based on environment configurations.
