import React, { useState } from 'react'
import LabeledInput from '@/components/molecules/LabeledInput'
import Button from '@/components/atoms/Button'
import LinkText from '@/components/atoms/LinkText'
import WelcomeText from '@/components/molecules/WelcomeText'
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
      <WelcomeText actionText="비밀번호 재설정하세요." />

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
        
        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm text-center font-medium">
            {error}
          </div>
        )}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          disabled={loading}
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? '전송 중...' : '비밀번호 재설정 이메일 보내기'}
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
