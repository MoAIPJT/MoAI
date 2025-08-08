import React, { useState } from 'react';
import LabeledInput from '@/components/molecules/LabeledInput';
import Button from '@/components/atoms/Button';
import LinkText from '@/components/atoms/LinkText';
import WelcomeText from '@/components/molecules/WelcomeText';
import type { SignupFormProps, SignupFormData } from './types';

const SignupForm: React.FC<SignupFormProps> = ({
  onSignup,
  onKakaoSignup,
  onGoogleSignup,
  loading = false,
  error = null
}) => {
  const [form, setForm] = useState<SignupFormData>({
    email: '',
    name: '',
    password: '',
    passwordConfirm: '',
  });


  const handleChange = (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setForm({ ...form, [field]: newValue });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.passwordConfirm) {
      return;
    }

    onSignup?.(form);
  };

  // 버튼 disabled 상태 확인
  const isButtonDisabled = loading || form.password !== form.passwordConfirm || !form.password || !form.passwordConfirm;

  return (
    <div className="w-full max-w-md">
<WelcomeText/>
      <form className="space-y-4" onSubmit={handleSignup}>
        <LabeledInput
          id="email"
          label="이메일"
          type="email"
          value={form.email}
          placeholder="이메일을 입력해주세요."
          onChange={handleChange('email')}
          fullWidth
        />
        <LabeledInput
          id="name"
          label="닉네임"
          value={form.name}
          placeholder="닉네임을 입력해주세요."
          onChange={handleChange('name')}
          fullWidth
        />
        <LabeledInput
          id="password"
          label="비밀번호"
          type="password"
          value={form.password}
          placeholder="비밀번호를 입력해주세요."
          onChange={handleChange('password')}
          fullWidth
        />
        <div className="space-y-1">
          <LabeledInput
            id="passwordConfirm"
            label="비밀번호 확인"
            type="password"
            value={form.passwordConfirm}
            placeholder="비밀번호를 다시 입력해주세요."
            onChange={handleChange('passwordConfirm')}
            fullWidth
          />
          {/* 비밀번호 일치 상태 표시 - 항상 공간 확보 */}
          <div className="h-5 flex items-center">
            {form.passwordConfirm && form.password && (
              <div className={`text-xs transition-opacity duration-200 ${form.password === form.passwordConfirm ? 'text-green-600' : 'text-red-500'}`}>
                {form.password === form.passwordConfirm ? '✅ 비밀번호가 일치합니다.' : '❌ 비밀번호가 일치하지 않습니다.'}
              </div>
            )}
          </div>
        </div>
        {/* 에러 메시지 */}
        {error && (
          <div className="text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        <Button
          variant="primary"
          size="lg"
          fullWidth
          type="submit"
          disabled={isButtonDisabled}
        >
          {loading ? '회원가입 중...' : '회원가입'}
        </Button>
        <Button variant="secondary" size="lg" fullWidth onClick={onKakaoSignup}>
          카카오톡 회원가입
        </Button>
        <Button variant="gray" size="lg" fullWidth onClick={onGoogleSignup}>
          구글 회원가입
        </Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-gray-600">이미 계정이 있으신가요? </span>
        <LinkText href="/login" variant="underline">로그인</LinkText>
      </div>
    </div>
  );
};

export default SignupForm;
