import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import LoginIllustration from '@/components/organisms/LoginIllustration'
import ResetPasswordConfirmForm from '@/components/organisms/ResetPasswordConfirmForm'
import { useResetPassword, useResetPasswordVerify } from '@/hooks/useUsers'
import type { ResetPasswordConfirmData } from '@/components/organisms/ResetPasswordConfirmForm/types'

const ResetPasswordConfirmTemplate: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const resetPasswordMutation = useResetPassword()
  const verifyTokenMutation = useResetPasswordVerify()

  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [isVerifying, setIsVerifying] = useState(true)

  // URL에서 파라미터 가져오기
  const code = searchParams.get('code') // 'token' 대신 'code' 사용
  const email = searchParams.get('email')

  // 페이지 로드 시 토큰 유효성 검증
  useEffect(() => {
    const verifyToken = async () => {
      if (!code || !email) {
        setIsTokenValid(false)
        setIsVerifying(false)
        return
      }

      try {
        await verifyTokenMutation.mutateAsync({ email, code: token })
        setIsTokenValid(true)
      } catch {
        setIsTokenValid(false)
      } finally {
        setIsVerifying(false)
      }
    }

    verifyToken()
  }, [code, email, verifyTokenMutation])

  const handleResetPassword = async (data: ResetPasswordConfirmData) => {
    if (!code || !email) {
      return
    }

    try {
      await resetPasswordMutation.mutateAsync({
        email: email,
        code: code,
        newPassword: data.password
      })

      // 성공 시 로그인 페이지로 이동
      navigate('/login', {
        state: { message: '비밀번호가 성공적으로 변경되었습니다.' }
      })
    } catch (error) {
      // 에러는 mutation에서 처리됨
    }
  }

  // 로딩 중일 때
  if (isVerifying) {
    return (
      <div className="flex min-h-screen bg-[#f9f9f9]">
        <div className="w-1/2 h-screen">
          <LoginIllustration />
        </div>
        <div className="w-1/2 flex justify-center items-center h-screen">
          <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">토큰을 검증하고 있습니다...</p>
          </div>
        </div>
      </div>
    )
  }

  // 토큰이 유효하지 않거나 없을 때
  if (!isTokenValid) {
    return (
      <div className="flex min-h-screen bg-[#f9f9f9]">
        <div className="w-1/2 h-screen">
          <LoginIllustration />
        </div>
        <div className="w-1/2 flex justify-center items-center h-screen">
          <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-red-600 mb-4">잘못된 링크입니다</h2>
            <p className="text-gray-600 mb-6">
              비밀번호 재설정 링크가 유효하지 않거나 만료되었습니다.
            </p>
            <a
              href="/reset-password"
              className="text-purple-600 hover:text-purple-700 font-semibold"
            >
              비밀번호 재설정 다시 요청하기
            </a>
          </div>
        </div>
      </div>
    )
  }

  // 토큰이 유효할 때 비밀번호 재설정 폼 표시
  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
          <ResetPasswordConfirmForm
            onResetPassword={handleResetPassword}
            loading={resetPasswordMutation.isPending}
            error={resetPasswordMutation.error?.message || null}
          />
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordConfirmTemplate
