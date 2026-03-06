import { AuthService } from "../services/AuthService";

export const logout = async (refreshToken: string) => {
    return AuthService.getInstance().logout(refreshToken);
};
