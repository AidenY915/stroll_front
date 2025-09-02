import { useState } from "react";
import Gnb from "./components/Gnb";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleSearch = (keywords: string) => {
    console.log("검색어:", keywords);
    // 여기에 검색 로직 구현
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    console.log("로그아웃");
  };

  const handleShowLogin = () => {
    console.log("로그인 모달 표시");
    // 로그인 모달 표시 로직
  };

  return (
    <>
      <Gnb
        isLoggedIn={isLoggedIn}
        onSearch={handleSearch}
        onLogout={handleLogout}
        onShowLogin={handleShowLogin}
      />
      <main style={{ paddingTop: "72px" }}>
        <Home />
        {/* 스크롤 테스트를 위한 더미 콘텐츠 */}
        <div style={{ height: "200vh", padding: "20px" }}>
          <h2>스크롤해서 GNB 색상 변경을 확인해보세요</h2>
          <p>스크롤을 내리면 GNB 배경색이 흰색으로 변경됩니다.</p>
          <p>검색 아이콘을 클릭하면 검색창이 나타납니다.</p>
        </div>
      </main>
    </>
  );
}

export default App;
