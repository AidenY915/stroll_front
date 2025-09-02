import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home: React.FC = () => {
  useEffect(() => {
    // Splide 슬라이더 초기화 (실제로는 라이브러리 설치 필요)
    // 여기서는 간단한 이미지 슬라이더로 구현
  }, []);

  const categories = [
    {
      icon: "/images/inn_icon.png",
      label: "펜션",
      link: "/aroundme?category=pension",
    },
    {
      icon: "/images/cafe_icon.svg",
      label: "카페",
      link: "/aroundme?category=cafe",
    },
    {
      icon: "/images/restaurant_icon.svg",
      label: "미용",
      link: "/aroundme?category=grooming",
    },
    {
      icon: "/images/hospital_icon.svg",
      label: "동물병원",
      link: "/aroundme?category=hospital",
    },
    {
      icon: "/images/playground_icon.svg",
      label: "놀이터",
      link: "/aroundme?category=playground",
    },
    {
      icon: "/images/kindergarten.svg",
      label: "유치원",
      link: "/aroundme?category=kindergarden",
    },
  ];

  return (
    <>
      <header className="main-header">
        <section className="banner-slider">
          <div className="slider-container">
            <div className="slide">
              <img
                className="bannerImg"
                src="/images/banner1.jpg"
                alt="배너 1"
              />
            </div>
            <div className="slide">
              <img
                className="bannerImg"
                src="/images/banner2.jpg"
                alt="배너 2"
              />
            </div>
            <div className="slide">
              <img
                className="bannerImg"
                src="/images/banner3.jpg"
                alt="배너 3"
              />
            </div>
          </div>
        </section>
      </header>

      <section className="container">
        <section className="category">
          {categories.map((category, index) => (
            <Link key={index} to={category.link}>
              <img src={category.icon} alt={category.label} />
              <p>{category.label}</p>
            </Link>
          ))}
        </section>

        <section className="news">
          <h2>산책갈까 소식</h2>
          <article>
            <p>반려동물과 함께하는 즐거운 산책 장소를 찾아보세요!</p>
            <p>새로운 장소들이 계속 업데이트되고 있습니다.</p>
          </article>
        </section>
      </section>

      <footer>{/* 푸터 내용 */}</footer>
    </>
  );
};

export default Home;
