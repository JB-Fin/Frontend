// 전체 레이아웃 선언, 배치, 랜더링 파트

import { Link, Outlet, useNavigate } from "react-router-dom";

function AppLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div>
      <header>
        <h1>컴플라이언스 AI</h1>

        <nav>
          <Link to="/">홈</Link> |{" "}
          <Link to="/review">AI 리뷰</Link> |{" "}
          <Link to="/history">히스토리</Link> |{" "}
          <Link to="/question">질문</Link> |{" "}
          <Link to="/settings">설정</Link>
        </nav>

        <button onClick={handleLogout}>로그아웃</button>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;