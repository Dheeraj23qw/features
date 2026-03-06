export class StorageError extends Error {
    constructor(message: string, public readonly code: string) {
        super(message);
        this.name = "StorageError";
    }
}

export class FileValidationError extends StorageError {
    constructor(message: string) {
        super(message, "FILE_VALIDATION_ERROR");
    }
}

export class FileProcessingError extends StorageError {
    constructor(message: string) {
        super(message, "FILE_PROCESSING_ERROR");
    }
}
