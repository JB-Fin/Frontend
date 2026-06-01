// 앱 라우팅: 로그인, 홈, AI 검토, 히스토리, 질문, 마이 페이지 경로 정의

import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "../components/layout/AppLayout";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import AiReviewPage from "../pages/AIReviewPage";
import ReviewDetailPage from "../pages/ReviewDetailPage";
import HistoryPage from "../pages/HistoryPage";
import HistoryDetailPage from "../pages/HistoryDetailPage";
import QuestionPage from "../pages/QuestionPage";
import SettingsPage from "../pages/SettingsPage";
import NotFoundPage from "../pages/NotFoundPage";

function AppRoutes() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <Routes>
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/" /> : <LoginPage />}
      />

      <Route
        path="/"
        element={isLoggedIn ? <AppLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<HomePage />} />
        <Route path="review" element={<AiReviewPage />} />
        <Route path="review/:id" element={<ReviewDetailPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="history/:id" element={<HistoryDetailPage />} />
        <Route path="question" element={<QuestionPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;