import { PasswordHasher } from "../security/PasswordHasher";

export class PasswordService {
    private hasher = new PasswordHasher();

    async hashPassword(plaintext: string): Promise<string> {
        return this.hasher.hash(plaintext);
    }

    async verifyPassword(plaintext: string, hash: string): Promise<boolean> {
        return this.hasher.verify(plaintext, hash);
    }
}
