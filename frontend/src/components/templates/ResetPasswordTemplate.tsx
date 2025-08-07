import React from 'react';
import LoginIllustration from '@/components/organisms/LoginIllustration';
import ResetPasswordForm from '@/components/organisms/ResetPasswordForm';

interface ResetPasswordTemplateProps {
  onResetPassword: (email: string) => void;
  loading: boolean;
  error: string | null;
}

const ResetPasswordTemplate: React.FC<ResetPasswordTemplateProps> = ({
  onResetPassword,
  loading,
  error
}) => {
  return (
    <div className="flex min-h-screen bg-[#f9f9f9]">
      <div className="w-1/2 h-screen">
        <LoginIllustration />
      </div>
      <div className="w-1/2 flex justify-center items-center h-screen">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
          <ResetPasswordForm
            onResetPassword={onResetPassword}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordTemplate; 