// 404 screen: 존재하지 않는 경로로 접근 시 경고 화면 구현

import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <h1>페이지를 찾을 수 없습니다.</h1>
      <Link to="/">홈으로 이동</Link>
    </div>
  );
}

export default NotFoundPage;