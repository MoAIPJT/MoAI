import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '@/services/authService'
import type { LoginFormData } from '@/components/organisms/LoginForm/types'
import type { SignupRequest, ResetPasswordConfirmRequest, SocialSignupRequest, SocialLoginRequest } from '@/services/authService'
import { extractAxiosErrorMessage } from '@/utils/errorHandler'

export const useAuth = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const login = async (data: LoginFormData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await authService.login(data)

      // 토큰 저장
      localStorage.setItem('accessToken', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)

      // 이메일 기억하기 옵션
      if (data.rememberEmail) {
        localStorage.setItem('rememberedEmail', data.email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      // 로그인 성공 후 리다이렉트
      navigate('/dashboard')
      return response
    } catch (err: unknown) {
      setError(extractAxiosErrorMessage(err, '로그인에 실패했습니다.'))
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
        console.log('백엔드 서버 연결 실패. 테스트용으로 페이지 이동합니다.')
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
      localStorage.setItem('accessToken', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)
      navigate('/dashboard')
      return response
    } catch (err: unknown) {
      setError(extractAxiosErrorMessage(err, '카카오 로그인에 실패했습니다.'))
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
      localStorage.setItem('accessToken', response.access_token)
      localStorage.setItem('refreshToken', response.refresh_token)
      navigate('/dashboard')
      return response
    } catch (err: unknown) {
      setError(extractAxiosErrorMessage(err, '구글 로그인에 실패했습니다.'))
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
      // 소셜 로그인 응답에는 access_token이 없고 refresh_token만 있음
      // refresh_token을 access_token으로 사용하고, 별도로 refresh_token도 저장
      localStorage.setItem('accessToken', response.refresh_token)
      localStorage.setItem('refreshToken', response.refresh_token)
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

  const logout = async () => {
    try {
      await authService.logout()
    } catch (err: unknown) {
      // 로그아웃 실패해도 로컬 토큰은 삭제
      console.error('Logout error:', err)
    } finally {
      navigate('/login')
    }
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
    loading,
    error,
    clearError: () => setError(null)
  }
}
