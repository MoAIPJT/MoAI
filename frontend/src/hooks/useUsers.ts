import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (user not found)
      if (error.code === '404') return false
      return failureCount < 3
    }
  })
}

// Mutation hooks
export const useLogin = () => {
  const setAuth = useAppStore((state) => state.auth.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: usersService.login,
    onSuccess: (data: TokenRes) => {
      setAuth({
        accessToken: data.access_token,
        refreshToken: data.refresh_token
      })
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: userKeys.me() })
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
        accessToken: data.access_token,
        refreshToken: data.refresh_token
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
      if (data && 'access_token' in data) {
        setAuth({
          accessToken: data.access_token,
          refreshToken: data.refresh_token
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
