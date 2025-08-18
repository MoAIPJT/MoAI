import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ResetPasswordVerifyTemplate from '@/components/templates/ResetPasswordVerifyTemplate'

const ResetPasswordVerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('')

  useEffect(() => {
    const emailParam = searchParams.get('email')
    const codeParam = searchParams.get('code')

    if (!emailParam || !codeParam) {
      setVerificationStatus('error')
      setErrorMessage('이메일 또는 인증 코드가 누락되었습니다.')
      return
    }

    setEmail(emailParam)
    setCode(codeParam)
  }, [searchParams])

  useEffect(() => {
    if (email && code) {
      // email과 code가 설정된 후에만 인증 검증 실행
      verifyResetPassword()
    }
  }, [email, code])

  const verifyResetPassword = async () => {
    try {
      // usersService의 resetPasswordVerify 함수 사용
      const { resetPasswordVerify } = await import('@/services/usersService')
      await resetPasswordVerify({ email, code })
      setVerificationStatus('success')
    } catch (error: any) {
      setVerificationStatus('error')
      setErrorMessage(error.message || '비밀번호 재설정 인증에 실패했습니다.')
    }
  }

  const handlePasswordReset = async (newPassword: string) => {
    try {
      const { resetPassword } = await import('@/services/usersService')
      // API 요청 구조에 맞게 code를 token으로 매핑
      await resetPassword({
        email,
        token: code,  // code를 token으로 전달
        newPassword
      })
      // 비밀번호 변경 성공 시 로그인 페이지로 이동
      navigate('/login', {
        state: { message: '비밀번호가 성공적으로 변경되었습니다. 새로운 비밀번호로 로그인해주세요.' }
      })
    } catch (error: any) {
      setErrorMessage(error.message || '비밀번호 변경에 실패했습니다.')
    }
  }

  return (
    <ResetPasswordVerifyTemplate
      status={verificationStatus}
      errorMessage={errorMessage}
      onPasswordReset={handlePasswordReset}
    />
  )
}

export default ResetPasswordVerifyPage
