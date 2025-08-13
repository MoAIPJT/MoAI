export interface LoginReq {
  email: string
  password: string
}

export interface TokenRes {
  accessToken: string
  refreshToken: string
}

export interface Profile {
  id?: number
  name: string
  email: string
  profileImageUrl?: string
  providerType?: string
  createdAt?: string
}

export interface ChangePasswordReq {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export interface ResetPasswordReq {
  email: string
}

export interface ResetPasswordVerifyReq {
  email: string
  code: string
}

export interface ResetPasswordUpdateReq {
  email: string
  code: string
  newPassword: string
}

export interface SocialSignupReq {
  email: string
  name: string
  providerType: string
  providerId: string
}

export interface SocialLoginReq {
  providerType: string
  providerId: string
}

export interface SignupReq {
  email: string
  name: string
  password: string
}

export interface VerifyEmailReq {
  email: string
  code: string
}

export interface SignupRes {
  email: string
  name: string
  message: string
}

export interface ApiError {
  code: string
  message: string
  fieldErrors?: Record<string, string>
}
