import React from 'react';
import LoginIllustration from '@/components/organisms/LoginIllustration';
import SignupForm from '@/components/organisms/SignupForm';

const SignupTemplate: React.FC = () => (
  <div className="flex min-h-screen bg-[#f9f9f9]">
    <div className="w-1/2 h-screen">
      <LoginIllustration />
    </div>
    <div className="w-1/2 flex justify-center items-center h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  </div>
);

export default SignupTemplate; 