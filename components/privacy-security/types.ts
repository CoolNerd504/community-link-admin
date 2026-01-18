export interface TwoFactorResponse {
    success: boolean
    enabled: boolean
    secret?: string
}

export interface ChangePasswordRequest {
    currentPassword: string
    newPassword: string
}

export type ProfileVisibility = "PUBLIC" | "PRIVATE" | "CONTACTS_ONLY"

export interface PrivacySettings {
    isOnline: boolean
    profileVisibility: ProfileVisibility
}

export interface ActiveSession {
    id: string
    device: string
    browser: string
    location: string
    lastActive: string
    isCurrent: boolean
}
