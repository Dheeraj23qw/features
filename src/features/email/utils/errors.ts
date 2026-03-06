export class EmailDeliveryError extends Error {
    public code: string;
    public retryable: boolean;

    constructor(message: string, code = "DELIVERY_ERROR", retryable = false) {
        super(message);
        this.name = "EmailDeliveryError";
        this.code = code;
        this.retryable = retryable;
    }
}

export class EmailCompileError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmailCompileError";
    }
}

export class EmailSecurityError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EmailSecurityError";
    }
}

export const safeErrorFormat = (error: any) => {
    return {
        success: false,
        code: error.code || "UNKNOWN_ERROR",
        message: error.message || "An unexpected error occurred",
    };
};
