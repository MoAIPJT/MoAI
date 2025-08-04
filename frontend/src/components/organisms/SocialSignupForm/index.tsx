import React, { useState } from 'react';
import LabeledInput from '@/components/molecules/LabeledInput';
import Button from '@/components/atoms/Button';
import LinkText from '@/components/atoms/LinkText';

interface SocialSignupFormProps {
  email: string;
  provider: 'google' | 'kakao';
}

const providerIcon: Record<string, string> = {
  google: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg',
  kakao: '/kakao-icon.png', 
};

const SocialSignupForm: React.FC<SocialSignupFormProps> = ({ email, provider }) => {
  const [nickname, setNickname] = useState('');

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 처리
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">환영합니다!</h1>
        <p className="text-gray-600">
          <span className="text-purple-600 font-semibold">MoAI</span> 에 가입하세요.
        </p>
      </div>
      <div className="flex items-center justify-center gap-2 mb-6">
        <img src={providerIcon[provider]} alt={provider} className="w-6 h-6" />
        <span className="text-gray-700">{email}</span>
      </div>
      <form className="space-y-6" onSubmit={handleSignup}>
        <LabeledInput
          id="nickname"
          label="닉네임"
          value={nickname}
          placeholder="닉네임을 입력해주세요."
          onChange={e => setNickname(e.target.value)}
          fullWidth
        />
        <Button variant="primary" size="lg" fullWidth>회원가입</Button>
      </form>
      <div className="text-center mt-6">
        <span className="text-gray-600">이미 계정이 있으신가요? </span>
        <LinkText href="/login" variant="underline">로그인</LinkText>
      </div>
    </div>
  );
};

export default SocialSignupForm; 