import { AuthService } from "../services/AuthService";
import type { ResetPasswordInput } from "../utils/validators";

export const verifyEmail = async (token: string) => {
    return AuthService.getInstance().verifyEmail(token);
};

export const requestPasswordReset = async (email: string) => {
    return AuthService.getInstance().requestPasswordReset(email);
};

export const resetPassword = async (input: ResetPasswordInput) => {
    return AuthService.getInstance().resetPassword(input);
};
