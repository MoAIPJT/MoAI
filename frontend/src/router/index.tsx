import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Lazy load all pages for better performance and code splitting
const LoginPage = React.lazy(() => import('@/pages/LoginPage'))
const SignupPage = React.lazy(() => import('@/pages/SignupPage'))
const EmailSentPage = React.lazy(() => import('@/pages/EmailSentPage'))
const PasswordSentPage = React.lazy(() => import('@/pages/PasswordSentPage'))
const SocialSignupPage = React.lazy(() => import('@/pages/SocialSignupPage'))
const ResetPasswordPage = React.lazy(() => import('@/pages/ResetPasswordPage'))
const ResetPasswordConfirmPage = React.lazy(() => import('@/pages/ResetPasswordConfirmPage'))
const AISummaryPage = React.lazy(() => import('@/pages/AISummaryPage'))
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'))
const TestPage = React.lazy(() => import('@/pages/TestPage'))
const StudyDetailPage = React.lazy(() => import('@/pages/StudyDetailPage'))
const VideoConferencePage = React.lazy(() => import('@/pages/VideoConferencePage'))
const GoogleCallback = React.lazy(() => import('@/pages/GoogleCallback'))

// Loading component for Suspense fallback
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
)

const Router: React.FC = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/password-sent" element={<PasswordSentPage />} />
        <Route path="/social-signup" element={<SocialSignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />
        <Route path="/ai-summary" element={<AISummaryPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/study/:hashId" element={<StudyDetailPage />} />
        <Route path="/video-conference" element={<VideoConferencePage />} />
        <Route path="/video-conference/:studyId" element={<VideoConferencePage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
      </Routes>
    </Suspense>
  )
}

export default Router
