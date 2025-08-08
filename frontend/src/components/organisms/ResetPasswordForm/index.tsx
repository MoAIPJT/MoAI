import React, { useState } from 'react'
import LabeledInput from '@/components/molecules/LabeledInput'
import Button from '@/components/atoms/Button'
import LinkText from '@/components/atoms/LinkText'
import type { ResetPasswordFormProps } from './types'

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onResetPassword,
  loading = false,
  error = null
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onResetPassword?.(email);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h1>
        <p className="text-gray-600">
          <span className="text-purple-600 font-semibold">MoAI</span> 비밀번호 재설정하세요.
        </p>
      </div>
      {/* 에러 메시지 */}
      {error && (
        <div className="text-red-500 text-sm text-center mb-4">
          {error}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <LabeledInput
          id="email"
          label="이메일"
          type="email"
          value={email}
          placeholder="이메일을 입력해주세요."
          onChange={e => setEmail(e.target.value)}
          fullWidth
        />
        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          disabled={loading}
        >
          <span className="flex items-center justify-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M3 12h15M15 6l6 6-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {loading ? '전송 중...' : '비밀번호 재설정 링크 보내기'}
          </span>
        </Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-gray-600">이미 계정이 있으신가요? </span>
        <LinkText href="/login" variant="underline">로그인</LinkText>
      </div>
    </div>
  );
};

export default ResetPasswordForm
