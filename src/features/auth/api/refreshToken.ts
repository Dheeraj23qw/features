import { AuthService } from "../services/AuthService";

export const refreshToken = async (token: string, ip?: string, userAgent?: string) => {
    return AuthService.getInstance().refreshToken(token, ip, userAgent);
};
