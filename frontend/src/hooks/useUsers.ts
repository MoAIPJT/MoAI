import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { userKeys } from './queryKeys'
import * as usersService from '@/services/usersService'
import { useAppStore } from '@/store/appStore'
import type {
  TokenRes
} from '@/types/users'

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
    }
  })
}

// Mutation hooks
export const useLogin = () => {
  const setAuth = useAppStore((state) => state.auth.setAuth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

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

      // 로그인 성공 후 dashboard로 이동
      navigate('/dashboard')
    }
  })
}

export const useSocialLogin = () => {
  const setAuth = useAppStore((state) => state.auth.setAuth)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: usersService.socialLogin,
    onSuccess: (data: TokenRes) => {
      setAuth({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken
      })
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.me() })

      // 소셜 로그인 성공 후 dashboard로 이동
      navigate('/dashboard')
    }
  })
}

export const useSignup = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: usersService.signup,
    onSuccess: (response, variables) => {
      // 회원가입 성공 후 email-sent 페이지로 이동
      navigate('/email-sent', {
        state: {
          message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
          email: variables.email
        }
      })
    }
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
        // Invalidate and refetch user profile
        queryClient.invalidateQueries({ queryKey: userKeys.me() })
      }
    }
  })
}

export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: usersService.verifyEmail
  })
}

export const useResetPasswordRequest = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: usersService.resetPasswordRequest,
    onSuccess: (response, email) => {
      // 비밀번호 재설정 요청 성공 후 password-sent 페이지로 이동
      navigate('/password-sent', {
        state: {
          message: '비밀번호 재설정 메일이 전송되었습니다.',
          email: email
        }
      })
    }
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
