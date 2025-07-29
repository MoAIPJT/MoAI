import React, { useState } from 'react';
import LabeledInput from '@/components/molecules/LabeledInput';
import Button from '@/components/atoms/Button';
import LinkText from '@/components/atoms/LinkText';
import type { ResetPasswordConfirmFormProps, ResetPasswordConfirmData } from './types';

const ResetPasswordConfirmForm: React.FC<ResetPasswordConfirmFormProps> = ({
  onResetPassword,
  loading = false,
  error = null
}) => {
  const [form, setForm] = useState<ResetPasswordConfirmData>({
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (field: keyof ResetPasswordConfirmData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.passwordConfirm) {
      return;
    }
    onResetPassword?.(form);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h1>
        <p className="text-gray-600">
          <span className="text-purple-600 font-semibold">MoAI</span> 새로운 비밀번호를 설정하세요.
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
          id="password"
          label="새 비밀번호"
          type="password"
          value={form.password}
          placeholder="새 비밀번호를 입력해주세요."
          onChange={handleChange('password')}
          fullWidth
        />
        <LabeledInput
          id="passwordConfirm"
          label="새 비밀번호 확인"
          type="password"
          value={form.passwordConfirm}
          placeholder="새 비밀번호를 다시 입력해주세요."
          onChange={handleChange('passwordConfirm')}
          fullWidth
        />
        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          disabled={loading}
        >
          {loading ? '비밀번호 변경 중...' : '비밀번호 변경'}
        </Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-gray-600">이미 계정이 있으신가요? </span>
        <LinkText href="/login" variant="underline">로그인</LinkText>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmForm; 