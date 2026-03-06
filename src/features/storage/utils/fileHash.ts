import * as crypto from "crypto";

export const generateFileHash = (buffer: Buffer): string => {
    return crypto.createHash("sha256").update(buffer).digest("hex");
};
