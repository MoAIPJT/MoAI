import React from 'react'
import sendEmailVideo from '@/assets/send_email.mp4'
import type { PasswordSentBoxProps } from './types'

const PasswordSentBox: React.FC<PasswordSentBoxProps> = ({
  message = '비밀번호 재설정 메일이 전송되었습니다.',
  email
}) => (
  <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-md flex flex-col items-center">
    <h2 className="text-xl font-bold text-center mb-4 mt-2">
      <span className="text-gray-900">환영합니다!<br/></span>
      <span className="text-purple-500 font-bold">MoAI</span> 비밀번호를 재설정하세요.
    </h2>
    <video
      className="my-8 w-64 h-auto rounded-xl"
      autoPlay
      muted
      loop
      playsInline
    >
      <source src={sendEmailVideo} type="video/mp4" />
      브라우저가 video 태그를 지원하지 않습니다.
    </video>
    <p className="text-center mb-6">
      <span className="text-purple-500 font-semibold">{message}</span>
    </p>
    {email && (
      <p className="text-gray-600 text-center mb-4">
        <span className="font-semibold">{email}</span>로 메일을 발송했습니다.
      </p>
    )}
    <p className="text-gray-800 text-center">
      24시간 내에 메일함을 확인하고<br />
      인증을 완료해주세요.
    </p>
  </div>
)

export default PasswordSentBox
