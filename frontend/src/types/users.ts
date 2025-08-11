export interface Profile {
  id: number
  email: string
  name: string
  nickname?: string
  profileImageUrl?: string
  providerType?: string
  isVerified?: boolean
  createdAt?: string
}

export interface LoginReq {
  email: string
  password: string
}

export interface TokenRes {
  accessToken: string
  refreshToken: string
}

export interface SignupReq {
  email: string
  password: string
  name: string
  nickname?: string
}

export interface SignupRes {
  user_id: number
  message: string
}

export interface ChangePasswordReq {
  currentPassword: string
  newPassword: string
}

export interface ResetPasswordReq {
  email: string
}

export interface ResetPasswordVerifyReq {
  email: string
  verificationCode: string
}

export interface ResetPasswordUpdateReq {
  email: string
  verificationCode: string
  newPassword: string
}

export interface SocialSignupReq {
  email: string
  name: string
  nickname?: string
  providerType: string
  providerId: string
}

export interface SocialLoginReq {
  providerType: string
  providerId: string
}

export interface ApiError {
  code: string
  message: string
}
