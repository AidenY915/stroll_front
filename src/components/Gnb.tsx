import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Gnb.css";

interface GnbProps {
  isLoggedIn?: boolean;
  onSearch?: (keywords: string) => void;
  onLogout?: () => void;
  onShowLogin?: () => void;
}

const Gnb: React.FC<GnbProps> = ({
  isLoggedIn = false,
  onSearch,
  onLogout,
  onShowLogin,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const gnbRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };

  const handleSearchBlur = () => {
    setIsSearchOpen(false);
    setSearchValue("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (onSearch && searchValue.trim()) {
        onSearch(searchValue.trim());
      }
      handleSearchBlur();
    }
  };

  const handleSearchFocus = () => {
    if (curtainRef.current) {
      curtainRef.current.style.display = "block";
    }
  };

  const handleSearchInputBlur = () => {
    if (curtainRef.current) {
      curtainRef.current.style.display = "none";
    }
    handleSearchBlur();
  };

  return (
    <>
      <section
        ref={gnbRef}
        id="gnb"
        className={`gnb ${isScrolled ? "scrolled" : ""} ${
          isSearchOpen ? "search-open" : ""
        }`}
      >
        <ul>
          <li className="logo">
            <Link to="/">산책갈까</Link>
          </li>

          {!isSearchOpen && (
            <>
              <li>
                <Link to="/aroundme">내 주변</Link>
              </li>

              {isLoggedIn && (
                <li>
                  <Link to="/mypage">마이페이지</Link>
                </li>
              )}

              <li>
                <Link to="/moreinfo">더보기</Link>
              </li>

              <li>
                {isLoggedIn ? (
                  <a onClick={onLogout} style={{ cursor: "pointer" }}>
                    로그아웃
                  </a>
                ) : (
                  <a onClick={onShowLogin} style={{ cursor: "pointer" }}>
                    로그인
                  </a>
                )}
              </li>
            </>
          )}

          <li className="search-container">
            <a id="searchBtn" onClick={handleSearchClick}>
              <img
                id="searchIcon"
                src={
                  isScrolled
                    ? "/images/search_icon_black.png"
                    : "/images/search_icon.png"
                }
                alt="검색"
              />
            </a>
            <input
              ref={searchInputRef}
              id="searchInput"
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={handleSearchFocus}
              onBlur={handleSearchInputBlur}
              style={{ display: isSearchOpen ? "block" : "none" }}
              placeholder="검색어를 입력하세요"
            />
          </li>
        </ul>
      </section>

      <div
        ref={curtainRef}
        className="search-curtain"
        style={{ display: "none" }}
      />
    </>
  );
};

export default Gnb;
