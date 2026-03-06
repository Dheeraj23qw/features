import type { AuthPayload } from "../types/index";
import { TokenSigner } from "../security/TokenSigner";

export class JWTStrategy {
    private signer = new TokenSigner();

    /** Extract and validate a Bearer token from an Authorization header. */
    extractFromHeader(header: string | undefined): AuthPayload {
        if (!header || !header.startsWith("Bearer ")) {
            throw new Error("Missing or malformed Authorization header.");
        }
        const token = header.slice(7);
        return this.signer.verify(token);
    }
}
