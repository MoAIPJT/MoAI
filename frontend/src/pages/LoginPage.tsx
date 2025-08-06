import React from 'react';
import LoginTemplate from '@/components/templates/LoginTemplate';
import { useAuth } from '@/hooks/useAuth';
import type { LoginFormData } from '@/components/organisms/LoginForm/types';

const LoginPage: React.FC = () => {
  const { login, loading, error } = useAuth();

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch {
      // 에러는 useAuth 훅에서 처리됨
    }
  };

  const handleKakaoLogin = async () => {
    // 카카오 로그인 URL로 리다이렉트
    const kakaoClientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/kakao/callback`;
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectUri}&response_type=code`;
    window.location.href = kakaoAuthUrl;
  };

const handleGoogleLogin = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  window.location.href = `${backendUrl}/oauth2/authorization/google`;
}

  return (
    <LoginTemplate
      onLogin={handleLogin}
      onKakaoLogin={handleKakaoLogin}
      onGoogleLogin={handleGoogleLogin}
      loading={loading}
      error={error}
    />
  );
};

export default LoginPage;
