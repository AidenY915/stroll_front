import React, { useState, useEffect, useCallback } from "react";
import "./AroundMe.css";

interface Place {
  placeNo: number;
  name: string;
  star: number;
  distance: number;
}

interface ApiResponse {
  places: Place[];
  lastPage: number;
}

const AroundMe: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [maxDistance, setMaxDistance] = useState(50);
  const [minStar, setMinStar] = useState(0);
  const [orderBy, setOrderBy] = useState("distance");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
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

  const fetchPlaces = useCallback(async () => {
    try {
      setLoading(true);

      // API 호출을 위한 쿼리 파라미터 구성
      const params = new URLSearchParams({
        category: selectedCategory,
        maxDistance: (maxDistance * 100).toString(), // 거리를 미터로 변환
        minStar: minStar.toString(),
        orderBy: orderBy,
        page: currentPage.toString(),
      });

      const response = await fetch(
        `http://localhost:8080/api/places?${params}`
      );

      if (!response.ok) {
        throw new Error("데이터를 불러오는데 실패했습니다");
      }

      const data: ApiResponse = await response.json();
      console.log(data);
      setPlaces(data.places);
      setLastPage(data.lastPage);
    } catch (error) {
      console.error("API 호출 에러:", error);
      // 에러 처리 로직 추가 가능
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, maxDistance, minStar, orderBy, currentPage]);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMyLocation(
            `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
          );
          // 위치 정보를 받아온 후 데이터 새로고침
          fetchPlaces();
        },
        () => {
          setMyLocation("위치를 가져올 수 없습니다");
        }
      );
    }
  };

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋
    fetchPlaces();
  };

  // 컴포넌트 마운트 시 및 검색 조건 변경 시 데이터 로드
  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

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
            {loading ? (
              <li style={{ textAlign: "center", padding: "20px" }}>
                데이터를 불러오는 중...
              </li>
            ) : places.length === 0 ? (
              <li style={{ textAlign: "center", padding: "20px" }}>
                검색 결과가 없습니다.
              </li>
            ) : (
              places.map((place) => (
                <li key={place.placeNo}>
                  <a href={`/place/${place.placeNo}`}>
                    <img
                      className="placeImg"
                      src={`/images/${place.placeNo}_1.jpg`}
                      onError={(e) => {
                        e.currentTarget.src = "/images/180x240_placeholder.jpg";
                      }}
                      alt={place.name}
                    />
                    <div>
                      <p>
                        <span className="placeName">{place.name}</span>
                        <span className="distance">{place.distance}m</span>
                      </p>
                      <p className="star">★ {place.star}</p>
                    </div>
                  </a>
                </li>
              ))
            )}
          </ul>

          <div className="pagingDiv">
            {lastPage > 1 && (
              <>
                {/* 이전 페이지 버튼 */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  style={{
                    margin: "0 5px",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    backgroundColor: currentPage === 1 ? "#f5f5f5" : "#fff",
                    cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  }}
                >
                  이전
                </button>

                {/* 페이지 번호 버튼들 */}
                {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                  const startPage = Math.max(
                    1,
                    Math.min(currentPage - 2, lastPage - 4)
                  );
                  const pageNum = startPage + i;

                  if (pageNum > lastPage) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        margin: "0 2px",
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        backgroundColor:
                          currentPage === pageNum ? "#007bff" : "#fff",
                        color: currentPage === pageNum ? "#fff" : "#000",
                        cursor: "pointer",
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {/* 다음 페이지 버튼 */}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(lastPage, prev + 1))
                  }
                  disabled={currentPage === lastPage}
                  style={{
                    margin: "0 5px",
                    padding: "8px 12px",
                    border: "1px solid #ddd",
                    backgroundColor:
                      currentPage === lastPage ? "#f5f5f5" : "#fff",
                    cursor:
                      currentPage === lastPage ? "not-allowed" : "pointer",
                  }}
                >
                  다음
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default AroundMe;
