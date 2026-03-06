import { StorageEvents, StorageEventType } from "../events/StorageEvents";

export class StorageLogger {
    constructor() {
        this.initialize();
    }

    private initialize() {
        const events: StorageEventType[] = [
            "file.uploaded",
            "file.deleted",
            "file.processed",
            "file.failed"
        ];

        events.forEach((event) => {
            StorageEvents.onEvent(event, (data) => {
                this.log(event, data);
            });
        });
    }

    private log(event: string, data: any) {
        const logData = {
            timestamp: new Date().toISOString(),
            module: "file_storage",
            event,
            fileId: data.fileObj?.id,
            filename: data.fileObj?.filename,
            mime: data.fileObj?.mimeType,
            size: data.fileObj?.size,
            provider: data.fileObj?.provider,
            error: data.error?.message || null,
        };

        if (data.error) {
            console.error(JSON.stringify({ level: "error", ...logData }));
        } else {
            console.log(JSON.stringify({ level: "info", ...logData }));
        }
    }
}

// Automatically initialize reliably cleanly safely smoothly smoothly fluently confidently
new StorageLogger();
