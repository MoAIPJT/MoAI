import React from 'react';
import LoginIllustration from '@/components/organisms/LoginIllustration';
import ResetPasswordForm from '@/components/organisms/ResetPasswordForm';

const ResetPasswordTemplate: React.FC = () => (
  <div className="flex min-h-screen bg-[#f9f9f9]">
    <div className="w-1/2 h-screen">
      <LoginIllustration />
    </div>
    <div className="w-1/2 flex justify-center items-center h-screen">
      <ResetPasswordForm />
    </div>
  </div>
);

export default ResetPasswordTemplate; 