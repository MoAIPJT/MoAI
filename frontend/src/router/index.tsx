import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/organisms/ProtectedRoute'

// Lazy load all pages for better performance and code splitting
const LoginPage = React.lazy(() => import('../pages/LoginPage'))
const SignupPage = React.lazy(() => import('../pages/SignupPage'))
const EmailSentPage = React.lazy(() => import('../pages/EmailSentPage'))
const EmailVerificationPage = React.lazy(() => import('../pages/EmailVerificationPage'))
const PasswordSentPage = React.lazy(() => import('../pages/PasswordSentPage'))
const SocialSignupPage = React.lazy(() => import('../pages/SocialSignupPage'))
const ResetPasswordPage = React.lazy(() => import('../pages/ResetPasswordPage'))
const ResetPasswordVerifyPage = React.lazy(() => import('../pages/ResetPasswordVerifyPage'))
const ResetPasswordConfirmPage = React.lazy(() => import('../pages/ResetPasswordConfirmPage'))
const AISummaryPage = React.lazy(() => import('../pages/AISummaryPage'))
const DashboardPage = React.lazy(() => import('../pages/DashboardPage'))
const TestPage = React.lazy(() => import('../pages/TestPage'))
const StudyDetailPage = React.lazy(() => import('../pages/StudyDetailPage'))
const VideoConferencePage = React.lazy(() => import('../pages/VideoConferencePage'))
const GoogleCallback = React.lazy(() => import('../pages/GoogleCallback'))

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
        {/* Public routes - no authentication required */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/email-sent" element={<EmailSentPage />} />
        <Route path="/users/verify-email" element={<EmailVerificationPage />} />
        <Route path="/password-sent" element={<PasswordSentPage />} />
        <Route path="/social-signup" element={<SocialSignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/users/reset-password/verify" element={<ResetPasswordVerifyPage />} />
        <Route path="/reset-password/confirm" element={<ResetPasswordConfirmPage />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Protected routes - authentication required */}
        <Route path="/ai-summary" element={
          <ProtectedRoute>
            <AISummaryPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/test" element={
          <ProtectedRoute>
            <TestPage />
          </ProtectedRoute>
        } />
        <Route path="/video-conference" element={
          <ProtectedRoute>
            <VideoConferencePage />
          </ProtectedRoute>
        } />
        <Route path="/video-conference/:studyId" element={
          <ProtectedRoute>
            <VideoConferencePage />
          </ProtectedRoute>
        } />

        {/* Study detail page - excluded from protection as requested */}
        <Route path="/study/:hashId" element={<StudyDetailPage />} />
      </Routes>
    </Suspense>
  )
}

export default Router
