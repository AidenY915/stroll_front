import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Gnb from "./components/Gnb";
import Home from "./pages/Home";
import AroundMe from "./pages/AroundMe";
import MoreInfo from "./pages/MoreInfo";
import MyPage from "./pages/MyPage";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (keywords: string) => {
    console.log("검색어:", keywords);
    // 실제로는 AroundMe 페이지로 이동하며 검색어를 전달
    window.location.href = `/aroundme?keywords=${encodeURIComponent(keywords)}`;
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("로그아웃");
    // 실제로는 서버에 로그아웃 요청을 보내고 홈으로 이동
  };

  const handleShowLogin = () => {
    console.log("로그인 모달 표시");
    // 로그인 모달 표시 로직
    // 임시로 로그인 상태 변경
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className="App">
        <Gnb
          isLoggedIn={isLoggedIn}
          onSearch={handleSearch}
          onLogout={handleLogout}
          onShowLogin={handleShowLogin}
        />
        <main style={{ paddingTop: "72px", minHeight: "calc(100vh - 72px)" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main" element={<Navigate to="/" replace />} />
            <Route path="/aroundme" element={<AroundMe />} />
            <Route path="/moreinfo" element={<MoreInfo />} />
            <Route
              path="/mypage"
              element={isLoggedIn ? <MyPage /> : <Navigate to="/" replace />}
            />
            {/* 추가 라우트들 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
