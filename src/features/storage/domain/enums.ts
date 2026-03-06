export enum StorageProviderType {
    LOCAL = "local",
    S3 = "s3",
    R2 = "r2",
    GCS = "gcs"
}

export enum FileStatus {
    PENDING = "PENDING",
    UPLOADED = "UPLOADED",
    PROCESSING = "PROCESSING",
    READY = "READY",
    FAILED = "FAILED",
}

export enum FileVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
}
