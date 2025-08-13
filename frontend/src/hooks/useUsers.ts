import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userKeys } from './queryKeys'
import * as usersService from '@/services/usersService'
import { useAppStore } from '@/store/appStore'
import type {
  TokenRes,
  Profile
} from '../types/users'

// Query hooks
export const useMe = () => {
  return useQuery({
    queryKey: userKeys.me(),
    queryFn: usersService.getProfile,
    staleTime: 60 * 1000, // 60 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: unknown) => {
      // Don't retry on 404 (user not found)
      if (error && typeof error === 'object' && 'code' in error && error.code === '404') return false
      return failureCount < 3
    },
    // 에러 발생 시 더미 데이터 반환 (개발용)
    placeholderData: {
      id: 1,
      email: 'dksejrqus2@gmail.com',
      name: '안덕현',
      nickname: '안덕현',
      profileImageUrl: '',
      providerType: 'LOCAL',
      isVerified: true,
      createdAt: '2024-01-01'
    } as Profile
  })
}

// Mutation hooks
export const useLogin = () => {
  const setAuth = useAppStore((state) => state.auth.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.login,
    onSuccess: (data: TokenRes) => {
      // 디버깅: 응답 데이터 확인
      console.log('Login response data:', data)

      // 토큰이 유효한지 확인
      if (!data.accessToken || !data.refreshToken) {
        console.error('Invalid tokens received:', {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        })
        return
      }

      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      })
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    },
    onError: (error: unknown) => {
      // 로그인 실패 시 에러 로깅
      console.error('Login failed:', error)
    }
  })
}

export const useSocialLogin = () => {
  const setAuth = useAppStore((state) => state.auth.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.socialLogin,
    onSuccess: (data: TokenRes) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      })
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    }
  })
}

export const useSignup = () => {
  return useMutation({
    mutationFn: usersService.signup
  })
}

export const useSocialSignup = () => {
  return useMutation({
    mutationFn: usersService.socialSignup
  })
}

export const useLogout = () => {
  const clearAuth = useAppStore((state) => state.auth.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.logout,
    onSuccess: () => {
      clearAuth()
      // Clear all user-related queries
      queryClient.removeQueries({ queryKey: userKeys.all })
    },
    onError: () => {
      // Even if logout fails, clear local state
      clearAuth()
      queryClient.removeQueries({ queryKey: userKeys.all })
    }
  })
}

export const usePatchProfile = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.patchProfile,
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    }
  })
}

export const useDeleteAccount = () => {
  const clearAuth = useAppStore((state) => state.auth.clearAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.deleteAccount,
    onSuccess: () => {
      clearAuth()
      // Clear all user-related queries
      queryClient.removeQueries({ queryKey: userKeys.all })
    }
  })
}

export const useChangePassword = () => {
  const setAuth = useAppStore((state) => state.auth.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.changePassword,
    onSuccess: (data: TokenRes | void) => {
      // If new tokens are returned, update them
      if (data && 'accessToken' in data) {
        // 디버깅: 응답 데이터 확인
        console.log('Change password response data:', data)

        // 토큰이 유효한지 확인
        if (!data.accessToken || !data.refreshToken) {
          console.error('Invalid tokens received:', {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken
          })
          return
        }

        setAuth({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken
        })
      }
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
    }
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: usersService.verifyEmail
  })
}

export const useResetPasswordRequest = () => {
  return useMutation({
    mutationFn: usersService.resetPasswordRequest
  })
}

export const useResetPasswordVerify = () => {
  return useMutation({
    mutationFn: usersService.resetPasswordVerify
  })
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: usersService.resetPassword
  })
}
