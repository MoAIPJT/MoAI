import React, { useState, useEffect } from 'react'
import Button from '@/components/atoms/Button'
import LabeledInput from '@/components/molecules/LabeledInput'
import LinkText from '@/components/atoms/LinkText'
import Checkbox from '@/components/atoms/CheckBox'
import type { LoginFormProps, LoginFormData } from './types'
import WelcomeText from '@/components/molecules/WelcomeText'

const LoginForm: React.FC<LoginFormProps> = ({
  onLogin,
  onKakaoLogin,
  onGoogleLogin,
  loading = false,
  error = null
}) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberEmail: false
  })

  // 에러가 발생해도 폼 상태는 유지
  // 에러 발생 시 비밀번호만 초기화 (보안상)
  useEffect(() => {
    if (error) {
      setFormData(prev => ({
        ...prev,
        password: '' // 비밀번호만 초기화
      }))
    }
  }, [error])

  const handleInputChange = (field: keyof LoginFormData) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (field === 'rememberEmail') {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: event.target.value
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin?.(formData)
  }

  return (
    <div className="w-full max-w-md">
      <WelcomeText/>

      {/* 로그인 폼 */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* 이메일 입력 */}
        <LabeledInput
          id="email"
          label="이메일"
          type="email"
          value={formData.email}
          placeholder="이메일을 입력해주세요."
          onChange={handleInputChange('email')}
          fullWidth
        />

        {/* 비밀번호 입력 */}
        <LabeledInput
          id="password"
          label="비밀번호"
          type="password"
          value={formData.password}
          placeholder="비밀번호를 입력해주세요."
          onChange={handleInputChange('password')}
          fullWidth
        />

        {/* 옵션 영역 */}
        <div className="flex items-center justify-between">
          <Checkbox
            id="rememberEmail"
            label="이메일 저장"
            checked={formData.rememberEmail}
            onChange={handleInputChange('rememberEmail')}
          />
          <LinkText href="/reset-password" variant="underline">
            비밀번호 초기화
          </LinkText>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm text-center font-medium">
            {error}
          </div>
        )}

        {/* 버튼 묶음: 딱 붙게 설정 */}
        <div className="flex flex-col gap-2">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            type="submit"
            disabled={loading}
          >
            {loading ? '로그인 중...' : '로그인하기'}
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={onKakaoLogin}
          >
            카카오톡 로그인
          </Button>

          <Button
            variant="gray"
            size="lg"
            fullWidth
            onClick={onGoogleLogin}
          >
            구글 로그인
          </Button>
        </div>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-center mt-6">
        <span className="text-gray-600">아직 계정이 없으신가요? </span>
        <LinkText href="/signup" variant="underline">
          회원가입
        </LinkText>
      </div>
    </div>
  )
}

export default LoginForm
