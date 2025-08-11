import apiClient from './api'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'

export interface LoginResponse {
  email: string
  name: string
  profileImageUrl: string
  accessToken: string
  refreshToken: string
}

export interface SignupRequest {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

export interface SignupResponse {
  email: string
  name: string
  password: string
  passwordConfirm: string
}

export interface SocialSignupRequest {
  providerType: string
  socialId: string
  name: string
  password: string
  email: string
  refreshToken: string
  profileImage: string
}

export interface SocialSignupResponse {
  socialProvider: string
  socialId: string
  name: string
  email: string
  refreshToken: string
  profileImageUrl: string
  createdAt: string
}

export interface SocialLoginRequest {
  accessToken: string
}

export interface SocialLoginResponse {
  socialProvider: string
  socialId: string
  name: string
  email: string
  refreshToken: string
  profileImageUrl: string
  createdAt: string
  metadata?: Record<string, unknown>
}

export interface ResetPasswordRequest {
  email: string
}

export interface ResetPasswordResponse {
  message: string
}

export interface ResetPasswordConfirmRequest {
  token: string
  password: string
}

export interface ResetPasswordConfirmResponse {
  message: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}

export interface RefreshTokenResponse {
  accessToken: string
}

// 일반 로그인 API
export const login = async (data: LoginFormData): Promise<LoginResponse> => {
  const response = await apiClient.post('/users/login', {
    email: data.email,
    password: data.password,
  })
  return response.data
}

// 일반 회원가입 API
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
  const response = await apiClient.post('/users/signup', {
    email: data.email,
    password: data.password,
    name: data.name,
  })
  return response.data
}

// 소셜 회원가입 API
export const socialSignup = async (data: SocialSignupRequest): Promise<SocialSignupResponse> => {
  const response = await apiClient.post('/social/signup', data, {
    headers: {
      'Authorization': `Bearer ${data.refreshToken}`
    }
  })
  return response.data
}

// 소셜 로그인 API
export const socialLogin = async (data: SocialLoginRequest): Promise<SocialLoginResponse> => {
  const response = await apiClient.post('/social/login', {}, {
    headers: {
      'Authorization': `Bearer ${data.accessToken}`
    }
  })
  return response.data
}

// 비밀번호 재설정 요청 API
export const requestResetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
  const response = await apiClient.post('/auth/reset-password', data)
  return response.data
}

// 소셜 로그인 (카카오) - 기존 함수 유지 (OAuth 코드 방식)
export const kakaoLogin = async (code: string): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/kakao', { code })
  return response.data
}

// 소셜 로그인 (구글) - 기존 함수 유지 (OAuth 코드 방식)
export const googleLogin = async (code: string): Promise<LoginResponse> => {
  const response = await apiClient.post('/auth/google', { code })
  return response.data
}

// 비밀번호 재설정 확인 API
export const confirmResetPassword = async (data: ResetPasswordConfirmRequest): Promise<ResetPasswordConfirmResponse> => {
  const response = await apiClient.post('/auth/reset-password/confirm', data)
  return response.data
}

// 토큰 갱신 API
export const refreshToken = async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
  const response = await apiClient.post('/auth/refresh', data)
  return response.data
}

// 로그아웃 API
export const logout = async (): Promise<void> => {
  await apiClient.post('/auth/logout')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
}
