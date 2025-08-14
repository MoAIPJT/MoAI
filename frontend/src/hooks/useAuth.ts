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

      // 로그인 성공 후 리다이렉트 - 저장된 URL이 있으면 해당 URL로, 없으면 대시보드로
      const redirectUrl = localStorage.getItem('redirectAfterLogin')
      console.log('Login successful, redirectUrl:', redirectUrl) // 디버깅용
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin') // 사용 후 제거
        console.log('Redirecting to:', redirectUrl) // 디버깅용
        // React Router navigate 문제를 피하기 위해 window.location.replace 사용
        // 강제로 페이지를 새로고침하여 컴포넌트 재마운트
        window.location.replace(redirectUrl)
      } else {
        console.log('No redirect URL, going to dashboard') // 디버깅용
        // React Router navigate 문제를 피하기 위해 window.location.replace 사용
        window.location.replace('/dashboard')
      }
      return response
    } catch (err: unknown) {
      // 이메일 인증 에러 처리
      if (err && typeof err === 'object' && 'code' in err) {
        const errorCode = (err as any).code
        if (errorCode === 'VALIDATION_ERROR') {
          // 검증 에러 처리 - fieldErrors에서 구체적인 메시지 추출
          const fieldErrors = (err as any).fieldErrors
          if (fieldErrors) {
            if (fieldErrors.email) {
              setError('이메일을 확인해주세요.')
            } else if (fieldErrors.password) {
              setError('비밀번호를 확인해주세요.')
            } else {
              setError('입력값을 확인해주세요.')
            }
          } else {
            setError('입력값을 확인해주세요.')
          }
        } else if (errorCode === 'EMAIL_NOT_VERIFIED') {
          setError('이메일 인증이 완료되지 않았습니다.')
        } else if (errorCode === 'USER_NOT_FOUND') {
          setError('등록되지 않은 이메일입니다.')
        } else if (errorCode === 'INVALID_PASSWORD') {
          setError('비밀번호가 올바르지 않습니다.')
        } else {
          setError((err as any).message || '로그인에 실패했습니다.')
        }
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('로그인에 실패했습니다.')
      }
      // throw err 제거하여 에러가 상위로 전파되지 않도록 함
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

    // 로그인 페이지로 이동 - React Router navigate 문제를 피하기 위해 window.location.replace 사용
    window.location.replace('/login')
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
