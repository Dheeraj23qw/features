import { StorageService } from "../services/StorageService";

export const deleteFile = async (id: string): Promise<void> => {
    const service = StorageService.getInstance();
    return service.deleteFile(id);
};
