import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import EmailVerificationTemplate from '../components/templates/EmailVerificationTemplate'
import { verifyEmail as verifyEmailService } from '../services/usersService'

const EmailVerificationPage: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const verifyEmail = async () => {
      const email = searchParams.get('email')
      const code = searchParams.get('code')

      if (!email || !code) {
        setVerificationStatus('error')
        setErrorMessage('이메일 또는 인증 코드가 누락되었습니다.')
        return
      }

      try {
        await verifyEmailService({ email, code })
        setVerificationStatus('success')
        // 3초 후 로그인 페이지로 리다이렉트
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } catch (error: any) {
        setVerificationStatus('error')
        setErrorMessage(error.message || '이메일 인증에 실패했습니다.')
      }
    }

    verifyEmail()
  }, [searchParams, navigate])

  return (
    <EmailVerificationTemplate
      status={verificationStatus}
      errorMessage={errorMessage}
    />
  )
}

export default EmailVerificationPage
