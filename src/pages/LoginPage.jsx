// 로그인 페이지 구현

import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    navigate("/");
  };

  return (
    <div style={{ padding: "40px", color: "black", background: "white" }}>
      <h1>로그인 화면 테스트</h1>
      <p>이 문장이 보이면 LoginPage 렌더링은 정상입니다.</p>
      <input placeholder="이메일" />
      <input type="password" placeholder="비밀번호" />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginPage;