import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '@/services/authService'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'
import type { SignupRequest, ResetPasswordConfirmRequest, SocialSignupRequest, SocialLoginRequest } from '@/services/authService'
import { extractAxiosErrorMessage } from '@/utils/errorHandler'

interface User {
  email: string
}

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

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
      const response = await authService.login(data)

      // 토큰 저장
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

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
      const errorMessage = extractAxiosErrorMessage(err, '로그인에 실패했습니다.')
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const signup = async (data: SignupRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.signup(data)
      navigate('/email-sent', {
        state: {
          message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
          email: data.email
        }
      })
      return response
    } catch (err: unknown) {
      const errorMessage = extractAxiosErrorMessage(err, '회원가입에 실패했습니다.')
      setError(errorMessage)

      // 백엔드 연결 실패 시에도 테스트용으로 페이지 이동
      if (errorMessage.includes('Network Error') || errorMessage.includes('ECONNREFUSED')) {
        navigate('/email-sent', {
          state: {
            message: '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.',
            email: data.email
          }
        })
      }

      throw err
    } finally {
      setLoading(false)
    }
  }

  const requestResetPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.requestResetPassword({ email })
      navigate('/password-sent', {
        state: {
          message: '비밀번호 재설정 메일이 전송되었습니다.',
          email: email
        }
      })
      return response
    } catch (err: unknown) {
      setError(extractAxiosErrorMessage(err, '비밀번호 재설정 요청에 실패했습니다.'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const kakaoLogin = async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.kakaoLogin(code)

      // 토큰 저장
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      // 인증 상태 업데이트
      setIsAuthenticated(true)
      setUser({ email: response.email })

      // 로그인 성공 후 리다이렉트
      navigate('/dashboard')
      return response
    } catch (err: unknown) {
      const errorMessage = extractAxiosErrorMessage(err, '카카오 로그인에 실패했습니다.')
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (code: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.googleLogin(code)

      // 토큰 저장
      localStorage.setItem('accessToken', response.accessToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      // 인증 상태 업데이트
      setIsAuthenticated(true)
      setUser({ email: response.email })

      // 로그인 성공 후 리다이렉트
      navigate('/dashboard')
      return response
    } catch (err: unknown) {
      const errorMessage = extractAxiosErrorMessage(err, '구글 로그인에 실패했습니다.')
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const socialSignup = async (data: SocialSignupRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.socialSignup(data)
      navigate('/login', {
        state: { message: '소셜 회원가입이 완료되었습니다. 로그인해주세요.' }
      })
      return response
    } catch (err: unknown) {
      setError(extractAxiosErrorMessage(err, '소셜 회원가입에 실패했습니다.'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const socialLogin = async (data: SocialLoginRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.socialLogin(data)
      // 소셜 로그인 응답에는 accessToken이 없고 refreshToken만 있음
      // refreshToken을 accessToken으로 사용하고, 별도로 refreshToken도 저장
      localStorage.setItem('accessToken', response.refreshToken)
      localStorage.setItem('refreshToken', response.refreshToken)

      // 인증 상태 업데이트
      setIsAuthenticated(true)
      setUser({ email: response.email })

      navigate('/dashboard')
      return response
    } catch (err: unknown) {
      setError(extractAxiosErrorMessage(err, '소셜 로그인에 실패했습니다.'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const confirmResetPassword = async (data: ResetPasswordConfirmRequest) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.confirmResetPassword(data)
      navigate('/login', {
        state: { message: '비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해주세요.' }
      })
      return response
    } catch (err: unknown) {
      setError(extractAxiosErrorMessage(err, '비밀번호 변경에 실패했습니다.'))
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    // 로컬 스토리지 정리
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')

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
    socialSignup,
    socialLogin,
    requestResetPassword,
    confirmResetPassword,
    kakaoLogin,
    googleLogin,
    logout,
    checkAuth,
    loading,
    error,
    isAuthenticated,
    user,
    clearError: () => setError(null)
  }
}
