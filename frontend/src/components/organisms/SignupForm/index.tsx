import React, { useState } from 'react';
import LabeledInput from '@/components/molecules/LabeledInput';
import Button from '@/components/atoms/Button';
import LinkText from '@/components/atoms/LinkText';
import WelcomeText from '@/components/molecules/WelcomeText';

const SignupForm: React.FC = () => {
  const [form, setForm] = useState({
    email: '',
    nickname: '',
    password: '',
    passwordConfirm: '',
  });

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 처리
  };

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
          id="nickname"
          label="닉네임"
          value={form.nickname}
          placeholder="닉네임을 입력해주세요."
          onChange={handleChange('nickname')}
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
        <LabeledInput
          id="passwordConfirm"
          label="비밀번호 확인"
          type="password"
          value={form.passwordConfirm}
          placeholder="비밀번호를 다시 입력해주세요."
          onChange={handleChange('passwordConfirm')}
          fullWidth
        />
        <Button variant="primary" size="lg" fullWidth>회원가입</Button>
        <Button variant="secondary" size="lg" fullWidth>카카오톡 회원가입</Button>
        <Button variant="gray" size="lg" fullWidth>구글 회원가입</Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-gray-600">이미 계정이 있으신가요? </span>
        <LinkText href="/login" variant="underline">로그인</LinkText>
      </div>
    </div>
  );
};

export default SignupForm; 