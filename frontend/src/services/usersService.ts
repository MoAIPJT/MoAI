import api from './api'
import type {
  LoginReq,
  TokenRes,
  Profile,
  ChangePasswordReq,
  ResetPasswordReq,
  ResetPasswordVerifyReq,
  ResetPasswordUpdateReq,
  SocialSignupReq,
  SocialLoginReq,
  SignupReq,
  SignupRes,
  VerifyEmailReq,
  ApiError
} from '@/types/users'
import type { ProfileData } from '@/components/organisms/ProfileSettingsModal/types'

// Error normalization helper
const normalizeError = (error: unknown): ApiError => {
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as { response?: { data?: { code?: string; message?: string; fieldErrors?: unknown }; status?: number; statusText?: string } }
    if (axiosError.response?.data) {
      const errorData = axiosError.response.data
              return {
          code: errorData.code || (axiosError.response.status ? axiosError.response.status.toString() : 'UNKNOWN_ERROR'),
          message: errorData.message || axiosError.response.statusText || 'An error occurred',
          fieldErrors: errorData.fieldErrors as Record<string, string> | undefined
        }
    }
    if (axiosError.response?.status) {
      return {
        code: axiosError.response.status.toString(),
        message: axiosError.response.statusText || 'An error occurred'
      }
    }
  }

  if (error instanceof Error) {
    return {
      code: 'UNKNOWN_ERROR',
      message: error.message || 'An unknown error occurred'
    }
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unknown error occurred'
  }
}

// Authentication endpoints
export const login = async (data: LoginReq): Promise<TokenRes> => {
  try {
    const response = await api.post<TokenRes>('/users/login', data)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const socialLogin = async (data: SocialLoginReq): Promise<TokenRes> => {
  try {
    const response = await api.post<TokenRes>('/users/social/login', data)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const signup = async (data: SignupReq): Promise<SignupRes> => {
  try {
    const response = await api.post<SignupRes>('/users/signup', data)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const socialSignup = async (data: SocialSignupReq): Promise<void> => {
  try {
    await api.post('/users/social/signup', data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const logout = async (): Promise<void> => {
  try {
    await api.get('/users/logout')
  } catch (error) {
    throw normalizeError(error)
  }
}

// Profile endpoints
export const getProfile = async (): Promise<Profile> => {
  try {
    const response = await api.get<Profile>('/users/profile')
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const patchProfile = async (data: Partial<ProfileData>): Promise<Profile> => {
  try {
    // multipart/form-data로 전송
    const formData = new FormData()

    if (data.name) {
      formData.append('name', data.name)
    }

    if (data.profileImageUrl) {
      // profileImageUrl이 File 객체인지 문자열인지 확인
      if (data.profileImageUrl instanceof File) {
        formData.append('image', data.profileImageUrl)
      } else {
        // 문자열인 경우 기존 이미지 URL로 처리
        formData.append('image', data.profileImageUrl)
      }
    }

    const response = await api.patch<Profile>('/users/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const deleteAccount = async (): Promise<void> => {
  try {
    await api.delete('/users/profile')
  } catch (error) {
    throw normalizeError(error)
  }
}

// Password management
export const changePassword = async (data: ChangePasswordReq): Promise<TokenRes | void> => {
  try {
    const response = await api.post<TokenRes>('/users/profile/change-password', data)
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const verifyEmail = async (params: VerifyEmailReq): Promise<void> => {
  try {
    await api.get('/users/verify-email', { params })
  } catch (error) {
    throw normalizeError(error)
  }
}

export const resetPasswordRequest = async (data: ResetPasswordReq): Promise<void> => {
  try {
    await api.post('/users/reset-password/request', data)
  } catch (error) {
    throw normalizeError(error)
  }
}

export const resetPasswordVerify = async (params: ResetPasswordVerifyReq): Promise<void> => {
  try {
    await api.get('/users/reset-password/verify', { params })
  } catch (error) {
    throw normalizeError(error)
  }
}

export const resetPassword = async (data: ResetPasswordUpdateReq): Promise<void> => {
  try {
    await api.patch('/users/reset-password', data)
  } catch (error) {
    throw normalizeError(error)
  }
}

// OAuth login functions
export const kakaoLogin = async (code: string): Promise<TokenRes> => {
  try {
    const response = await api.post<TokenRes>('/users/oauth/kakao', { code })
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}

export const googleLogin = async (code: string): Promise<TokenRes> => {
  try {
    const response = await api.post<TokenRes>('/users/oauth/google', { code })
    return response.data
  } catch (error) {
    throw normalizeError(error)
  }
}
