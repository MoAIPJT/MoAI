import React from 'react'
import SignupTemplate from '@/components/templates/SignupTemplate'
import { useAuth } from '@/hooks/useAuth'
import type { SignupFormData } from '@/components/organisms/SignupForm/types'

const SignupPage: React.FC = () => {
  const { signup, loading, error } = useAuth();

  const handleSignup = async (data: SignupFormData) => {
    try {
      await signup({
        email: data.email,
        password: data.password,
        name: data.name,
        passwordConfirm: data.passwordConfirm
      });
    } catch {
      // 에러는 useAuth 훅에서 처리됨
    }
  };

  const handleKakaoSignup = () => {
    // 카카오 회원가입 URL로 리다이렉트
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

  const handleGoogleSignup = () => {
    // 구글 회원가입 URL로 리다이렉트
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${redirectUri}&response_type=code&scope=email profile`;
    window.location.href = googleAuthUrl;
  };

  return (
    <SignupTemplate
      onSignup={handleSignup}
      onKakaoSignup={handleKakaoSignup}
      onGoogleSignup={handleGoogleSignup}
      loading={loading}
      error={error}
    />
  );
  }

  export default SignupPage
