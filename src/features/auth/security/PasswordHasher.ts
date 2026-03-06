import * as bcrypt from "bcryptjs";

export class PasswordHasher {
    private readonly SALT_ROUNDS = 12;

    async hash(plaintext: string): Promise<string> {
        return bcrypt.hash(plaintext, this.SALT_ROUNDS);
    }

    async verify(plaintext: string, hash: string): Promise<boolean> {
        // bcrypt.compare is timing-safe by design
        return bcrypt.compare(plaintext, hash);
    }
}
