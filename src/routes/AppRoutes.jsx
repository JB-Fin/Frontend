// 앱 라우팅: 로그인, 홈, AI 검토, 히스토리, 질문, 마이 페이지 경로 정의
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import ProtectedRoute from '../components/layout/ProtectedRoute'

import LoginPage        from '../pages/LoginPage'
import HomePage         from '../pages/HomePage'
import AIReviewPage     from '../pages/AIReviewPage'
import ReviewDetailPage from '../pages/ReviewDetailPage'
import HistoryPage      from '../pages/HistoryPage'
import HistoryDetailPage from '../pages/HistoryDetailPage'
import QuestionPage     from '../pages/QuestionPage'
import SettingsPage     from '../pages/SettingsPage'
import NotFoundPage     from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 진입 → 로그인 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 로그인 (인증 불필요) */}
        <Route path="/login" element={<LoginPage />} />

        {/* 로그인 후 접근 가능한 페이지들 — AppLayout 안에 Sidebar + Header 공통 적용 */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* 홈 대시보드 */}
          <Route path="home" element={<HomePage />} />

          {/* AI 문서 검토 — 업로드 */}
          <Route path="review" element={<AIReviewPage />} />

          {/* 검토 결과 상세 (/review/doc-001) */}
          <Route path="review/:docId" element={<ReviewDetailPage />} />

          {/* 작업 내역 목록 */}
          <Route path="history" element={<HistoryPage />} />

          {/* 작업 내역 상세 — 탭 없이 접근 시 result 탭으로 기본 진입 */}
          <Route path="history/:docId" element={<Navigate to="result" replace />} />

          {/* 작업 내역 상세 — 탭별 (/history/doc-001/result|diff|report) */}
          <Route path="history/:docId/:tab" element={<HistoryDetailPage />} />

          {/* 질문 채팅 */}
          <Route path="question" element={<QuestionPage />} />

          {/* 설정 */}
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
