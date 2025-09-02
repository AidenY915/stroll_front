import React, { useState, useEffect } from "react";
import "./AroundMe.css";

interface Place {
  no: number;
  title: string;
  guAddress: string;
  afterGuAddress: string;
  detailAddress: string;
  star: number;
  distance?: number;
}

const AroundMe: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxDistance, setMaxDistance] = useState(50);
  const [minStar, setMinStar] = useState(0);
  const [orderBy, setOrderBy] = useState("distance");
  const [currentPage, setCurrentPage] = useState(1);
  const [myLocation, setMyLocation] = useState("위치를 가져오는 중...");

  const categories = [
    { key: "", label: "전체" },
    { key: "pension", label: "펜션" },
    { key: "cafe", label: "카페" },
    { key: "grooming", label: "미용" },
    { key: "hospital", label: "동물병원" },
    { key: "playground", label: "놀이터" },
    { key: "kindergarden", label: "유치원" },
  ];

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation(
            `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
          );
          // 여기에서 실제 주소 변환 로직을 구현할 수 있습니다
        },
        (error) => {
          setMyLocation("위치를 가져올 수 없습니다");
        }
      );
    }
  };

  const handleSearch = () => {
    // 실제 검색 로직을 구현합니다
    console.log("검색 조건:", {
      category: selectedCategory,
      maxDistance,
      minStar,
      orderBy,
      page: currentPage,
    });
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>내 주변</h1>
          <p>
            <span id="myLocation">내 위치: {myLocation}</span>
            <button className="locationBtn" onClick={handleLocationClick}>
              내 위치 설정
            </button>
          </p>
        </div>
      </header>

      <div className="container">
        <ul className="categoryUl">
          {categories.map((category) => (
            <li
              key={category.key}
              data-category={category.key}
              className={selectedCategory === category.key ? "active" : ""}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </li>
          ))}
          <button
            id="addNewPlaceBtn"
            type="button"
            onClick={() => (window.location.href = "/newplace")}
          >
            새 장소 등록
          </button>
        </ul>

        <aside className="sideFilter">
          <div className="distanceFilter">
            거리
            <input
              className="filterSlider"
              type="range"
              min="1"
              max="50"
              value={maxDistance}
              onChange={(e) => setMaxDistance(parseInt(e.target.value))}
            />
            <p id="maxDistance">내 주변 {maxDistance}00m 이하</p>
          </div>

          <div className="starFilter">
            별점
            <input
              className="filterSlider"
              type="range"
              min="0"
              max="5"
              value={minStar}
              onChange={(e) => setMinStar(parseInt(e.target.value))}
            />
            <p id="minStar">★{minStar}개 이상</p>
          </div>

          <button className="submitBtn" type="button" onClick={handleSearch}>
            다시 찾기
          </button>
        </aside>

        <section className="resultContents">
          <ul className="orderByUl">
            <li
              data-order="distance"
              className={orderBy === "distance" ? "active" : ""}
              onClick={() => setOrderBy("distance")}
            >
              거리 순
            </li>
            <li
              data-order="star"
              className={orderBy === "star" ? "active" : ""}
              onClick={() => setOrderBy("star")}
            >
              별점 순
            </li>
          </ul>

          <ul className="results">
            {places.map((place) => (
              <li key={place.no}>
                <a href={`/detail/${place.no}`}>
                  <img
                    className="placeImg"
                    src={`/images/${place.no}_1.jpg`}
                    onError={(e) => {
                      e.currentTarget.src = "/images/180x240_placeholder.jpg";
                    }}
                    alt={place.title}
                  />
                  <div>
                    <p>
                      <span className="placeName">{place.title}</span>
                      {place.distance && (
                        <span className="distance">{place.distance}m</span>
                      )}
                    </p>
                    <p>
                      {place.guAddress} {place.afterGuAddress}{" "}
                      {place.detailAddress}
                    </p>
                    <p className="star">★ {place.star}</p>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <div className="pagingDiv">{/* 페이징 버튼들을 여기에 구현 */}</div>
        </section>
      </div>
    </>
  );
};

export default AroundMe;
