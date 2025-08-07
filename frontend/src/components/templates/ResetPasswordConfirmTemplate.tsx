import React from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginIllustration from '@/components/organisms/LoginIllustration';
import ResetPasswordConfirmForm from '@/components/organisms/ResetPasswordConfirmForm';
import { useAuth } from '@/hooks/useAuth';
import type { ResetPasswordConfirmData } from '@/components/organisms/ResetPasswordConfirmForm/types';

const ResetPasswordConfirmTemplate: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { confirmResetPassword, loading, error } = useAuth();
  
  // URL에서 토큰 파라미터 가져오기
  const token = searchParams.get('token');

  const handleResetPassword = async (data: ResetPasswordConfirmData) => {
    if (!token) {
      return;
    }
    
    try {
      await confirmResetPassword({
        token: token,
        password: data.password
      });
    } catch {
      // 에러는 useAuth 훅에서 처리됨
    }
  };

  // 토큰이 없으면 에러 메시지 표시
  if (!token) {
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
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
          <ResetPasswordConfirmForm
            onResetPassword={handleResetPassword}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirmTemplate; 