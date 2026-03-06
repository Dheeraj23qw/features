export enum AuthStrategy {
    EMAIL_PASSWORD = "EMAIL_PASSWORD",
    OAUTH = "OAUTH",
    MAGIC_LINK = "MAGIC_LINK",
    MFA = "MFA",
}

export enum UserStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    SUSPENDED = "SUSPENDED",
    PENDING_VERIFICATION = "PENDING_VERIFICATION",
}

export enum TokenType {
    ACCESS = "ACCESS",
    REFRESH = "REFRESH",
    EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
    PASSWORD_RESET = "PASSWORD_RESET",
    MFA = "MFA",
}

export enum OAuthProviderType {
    GOOGLE = "GOOGLE",
    GITHUB = "GITHUB",
}

export enum MFAMethod {
    TOTP = "TOTP",
    EMAIL_CODE = "EMAIL_CODE",
}
