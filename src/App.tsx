import { useState, useEffect } from "react";
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
import Place from "./pages/Place";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NewPlace from "./pages/NewPlace";
import { isLoggedIn, logout } from "./utils/auth";
import "./App.css";

function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  // 앱 시작 시 로그인 상태 확인
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = isLoggedIn();
      setUserLoggedIn(loggedIn);
    };

    checkLoginStatus();

    // 스토리지 변경 감지 (다른 탭에서 로그인/로그아웃 시)
    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleSearch = (keywords: string) => {
    console.log("검색어:", keywords);
    // 실제로는 AroundMe 페이지로 이동하며 검색어를 전달
    window.location.href = `/aroundme?keywords=${encodeURIComponent(keywords)}`;
  };

  const handleLogout = () => {
    logout();
    setUserLoggedIn(false);
    console.log("로그아웃 완료");
  };

  const handleShowLogin = () => {
    // 로그인 페이지로 이동
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="App">
        <Gnb
          isLoggedIn={userLoggedIn}
          onSearch={handleSearch}
          onLogout={handleLogout}
          onShowLogin={handleShowLogin}
        />
        <main style={{ paddingTop: "72px", minHeight: "calc(100vh - 72px)" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main" element={<Navigate to="/" replace />} />
            <Route path="/aroundme" element={<AroundMe />} />
            <Route path="/place/:placeNo" element={<Place />} />
            <Route path="/moreinfo" element={<MoreInfo />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/newplace"
              element={
                userLoggedIn ? <NewPlace /> : <Navigate to="/login" replace />
              }
            />
            <Route
              path="/mypage"
              element={
                userLoggedIn ? <MyPage /> : <Navigate to="/login" replace />
              }
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
