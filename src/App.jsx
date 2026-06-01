// App.jsx는 AppRoutes에게 어떤 페이지를 보여줄 지 맡김 -> 화면 직접 생성x

import AppRoutes from "./routes/AppRoutes";

import "./styles/global.css";
import "./styles/layout.css";
import "./styles/auth.css";
import "./styles/home.css";
import "./styles/review.css";
import "./styles/history.css";
import "./styles/chat.css";
import "./styles/settings.css";

function App() {
  return <AppRoutes />;
}

export default App;