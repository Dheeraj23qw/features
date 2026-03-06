import { StorageProvider } from "./StorageProvider";
import { StorageProviderType } from "../domain/enums";
import { FileUploadOptions, StorageResult } from "../types";
import { buildStorageKey } from "../utils/pathBuilder";
import { getStorageConfig } from "../utils/config";

export class S3ProviderStub implements StorageProvider {
  readonly type = StorageProviderType.S3;
  private bucket: string;

  constructor() {
    const config = getStorageConfig();
    this.bucket = config.S3_BUCKET_NAME || "default-s3-bucket";
  }

  async upload(
    file: Buffer,
    options: FileUploadOptions,
  ): Promise<StorageResult> {
    const storageKey = buildStorageKey(options.filename, options.folder);

    console.log(`[S3Provider] Connecting to s3://${this.bucket}`);
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log(
      `[S3Provider] Successfully uploaded securely to s3://${this.bucket}/${storageKey}`,
    );

    return {
      storageKey,
      url: `https://${this.bucket}.s3.amazonaws.com/${storageKey}`,
    };
  }

  async delete(storageKey: string): Promise<void> {
    console.log(`[S3Provider] Deleted s3://${this.bucket}/${storageKey}`);
    await new Promise((resolve) => setTimeout(resolve, 150));
  }

  async getUrl(storageKey: string): Promise<string> {
    return `https://${this.bucket}.s3.amazonaws.com/${storageKey}`;
  }
}
