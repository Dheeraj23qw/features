import { AuthService } from "../services/AuthService";
import type { LoginInput } from "../utils/validators";

export const login = async (input: LoginInput, ip?: string, userAgent?: string) => {
    return AuthService.getInstance().login(input, ip, userAgent);
};
