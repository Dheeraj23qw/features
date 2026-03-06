import { EventEmitter } from "events";
import { FileObject } from "../domain/models";

export type StorageEventType =
    | "file.uploaded"
    | "file.deleted"
    | "file.processed"
    | "file.failed";

class StorageEventsEmitter extends EventEmitter {
    emitEvent(event: StorageEventType, fileObj: Partial<FileObject>, error?: Error) {
        this.emit(event, { fileObj, error, timestamp: new Date() });
    }

    onEvent(event: StorageEventType, listener: (data: any) => void) {
        this.on(event, listener);
    }
}

export const StorageEvents = new StorageEventsEmitter();
