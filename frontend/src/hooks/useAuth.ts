import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLogin, useSignup } from './useUsers'
import { useAppStore } from '@/store/appStore'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'
import type { SignupRequest } from '@/services/authService'

interface User {
  email: string
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  const clearAuth = useAppStore((state) => state.auth.clearAuth)

  const loginMutation = useLogin()
  const signupMutation = useSignup()

  // 컴포넌트 마운트 시 인증 상태 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      setIsAuthenticated(true)
      // 간단한 사용자 정보 설정 (토큰에서 추출하거나 기본값)
      setUser({ email: localStorage.getItem('rememberedEmail') || '사용자' })
    }
  }, [])

  const login = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      })

      // 이메일 기억하기 옵션
      if (data.rememberEmail) {
        localStorage.setItem('rememberedEmail', data.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // 인증 상태 업데이트
      setIsAuthenticated(true)
      setUser({ email: data.email })

      // 로그인 성공 후 리다이렉트
      navigate('/dashboard')
      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('로그인에 실패했습니다.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data: SignupRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await signupMutation.mutateAsync(data)
      navigate('/email-sent', {
        state: {
          message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
          email: data.email
        }
      })
      return response
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('회원가입에 실패했습니다.')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // 로컬 스토리지 정리
    clearAuth()

    // 인증 상태 초기화
    setIsAuthenticated(false)
    setUser(null)

    // 로그인 페이지로 이동
    navigate('/login')
  }

  // 간단한 인증 체크 함수
  const checkAuth = () => {
    const token = localStorage.getItem('accessToken')
    return !!token
  }

  return {
    login,
    signup,
    logout,
    checkAuth,
    loading,
    error,
    isAuthenticated,
    user,
    clearError: () => setError(null)
  }
}
