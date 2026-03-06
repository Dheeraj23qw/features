import { StorageService } from "../services/StorageService";
import { FileUploadOptions, FileObject } from "../types";

export const uploadFile = async (buffer: Buffer, options: FileUploadOptions): Promise<FileObject> => {
    const service = StorageService.getInstance();
    return service.uploadFile(buffer, options);
};
