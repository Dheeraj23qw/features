import { StorageService } from "../services/StorageService";

export const getFileUrl = async (id: string): Promise<string> => {
    const service = StorageService.getInstance();
    return service.getFileUrl(id);
};
