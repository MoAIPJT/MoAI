import React from 'react'
import Lottie from 'lottie-react'
import emailSentAnimation from '@/assets/email-sent.json'
import WelcomeText from '@/components/molecules/WelcomeText'
import LinkText from '@/components/atoms/LinkText'
import type { EmailSentBoxProps } from './types'

const EmailSentBox: React.FC<EmailSentBoxProps> = ({
  message = '이메일 인증 메일이 전송되었습니다.',
  email
}) => (
  <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md flex flex-col items-center">
    <WelcomeText actionText="가입을 축하드려요." />
  <div className="my-8 w-64 h-64 flex items-center justify-center">
    <Lottie
      animationData={emailSentAnimation}
      loop={true}
      autoplay={true}
      className="w-full h-full"
    />
  </div>
    <p className="text-center mb-6">
      <span className="text-purple-500 font-semibold">{message}</span>
    </p>
    {email && (
      <p className="text-gray-600 text-center mb-4">
        <span className="font-semibold">{email}</span>로 메일을 발송했습니다.
      </p>
    )}
          <p className="text-gray-800 text-center">
        메일함을 확인하고 인증을 완료해주세요.
      </p>
      <div className="text-center mt-6">
        <LinkText href="/login" variant="underline">로그인 바로가기</LinkText>
      </div>
    </div>
)

export default EmailSentBox
