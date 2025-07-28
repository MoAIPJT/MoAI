import React from 'react';
import LoginIllustration from '@/components/organisms/LoginIllustration';
import EmailSentBox from '@/components/organisms/EmainSentBox';

const EmailSentTemplate: React.FC = () => (
  <div className="flex min-h-screen bg-[#f9f9f9]">
    <div className="w-1/2 h-screen">
      <LoginIllustration />
    </div>
    <div className="w-1/2 flex justify-center items-center h-screen">
      <EmailSentBox />
    </div>
  </div>
);

export default EmailSentTemplate; 