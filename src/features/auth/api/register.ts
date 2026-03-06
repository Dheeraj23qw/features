import { AuthService } from "../services/AuthService";
import type { RegisterInput } from "../utils/validators";

export const register = async (input: RegisterInput, ip?: string, userAgent?: string) => {
    return AuthService.getInstance().register(input, ip, userAgent);
};
