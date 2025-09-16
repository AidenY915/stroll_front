import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getApiUrl } from "../utils/config";
import { isLoggedIn } from "../utils/auth";
import LocationModal from "../components/LocationModal";
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
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [maxDistance, setMaxDistance] = useState(
    parseInt(searchParams.get("maxDistance") || "50")
  );
  const [minStar, setMinStar] = useState(
    parseInt(searchParams.get("minStar") || "0")
  );
  const [orderBy, setOrderBy] = useState("distance");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState(searchParams.get("keywords") || "");
  const [myLocation, setMyLocation] = useState("위치를 가져오는 중...");
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(() => {
    const x = searchParams.get("x");
    const y = searchParams.get("y");
    if (x && y) {
      return { lat: parseFloat(y), lng: parseFloat(x) };
    }
    return null;
  });
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [hasCoordinates, setHasCoordinates] = useState(() => {
    const x = searchParams.get("x");
    const y = searchParams.get("y");
    return !!(x && y);
  });

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

      // URL에서 현재 파라미터 값들을 가져와서 API 호출에 사용
      const currentKeywords = searchParams.get("keywords") || "";
      const currentMaxDistance = parseInt(
        searchParams.get("maxDistance") || "50"
      );
      const currentMinStar = parseInt(searchParams.get("minStar") || "0");
      const currentCategory = searchParams.get("category") || "";
      const currentX = searchParams.get("x"); // 경도
      const currentY = searchParams.get("y"); // 위도

      // API 호출을 위한 쿼리 파라미터 구성
      const params = new URLSearchParams({
        category: currentCategory,
        maxDistance: currentMaxDistance.toString(), // URL과 동일한 값 사용
        minStar: currentMinStar.toString(),
        orderBy: orderBy,
        page: currentPage.toString(),
      });

      // 좌표가 있는 경우에만 파라미터에 추가
      if (currentX && currentY) {
        params.append("x", currentX); // 경도
        params.append("y", currentY); // 위도
      }

      // keywords가 있는 경우에만 파라미터에 추가 (띄어쓰기로 구분된 여러 단어 처리)
      if (currentKeywords.trim()) {
        params.append("keywords", currentKeywords.trim());
      }

      // 디버깅을 위한 로그
      console.log("API 요청 파라미터:", {
        currentKeywords,
        currentMaxDistance,
        currentMinStar,
        currentCategory,
        currentX,
        currentY,
        orderBy,
        currentPage,
        finalParams: params.toString(),
      });

      const apiUrl = await getApiUrl(`/api/places?${params}`);
      console.log("최종 API URL:", apiUrl);
      const response = await fetch(apiUrl);

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
  }, [selectedCategory, orderBy, currentPage, searchParams]);

  const handleLocationClick = () => {
    // 현재 위치 가져오기 시도
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });

          // URL 파라미터에 현재 위치 좌표 추가
          const newSearchParams = new URLSearchParams(searchParams);
          newSearchParams.set("x", longitude.toString()); // 경도
          newSearchParams.set("y", latitude.toString()); // 위도
          setSearchParams(newSearchParams);

          setIsLocationModalOpen(true);
        },
        (error) => {
          console.warn("현재 위치를 가져올 수 없습니다:", error);
          // 현재 위치를 가져올 수 없어도 모달은 열기 (기본 위치로)
          setIsLocationModalOpen(true);
        }
      );
    } else {
      // Geolocation을 지원하지 않는 경우에도 모달 열기
      setIsLocationModalOpen(true);
    }
  };

  // 위치 선택 완료 처리
  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setMyLocation(location.address);
    setCurrentCoords({ lat: location.lat, lng: location.lng });

    // URL 파라미터에 좌표 추가
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("x", location.lng.toString()); // 경도
    newSearchParams.set("y", location.lat.toString()); // 위도
    setSearchParams(newSearchParams);

    // URL 업데이트 후 fetchPlaces는 useEffect에 의해 자동으로 호출됨
  };

  const handleSearch = () => {
    setCurrentPage(1); // 검색 시 첫 페이지로 리셋

    // URL 파라미터 업데이트
    const newSearchParams = new URLSearchParams(searchParams);

    // keywords 파라미터 설정
    if (keywords.trim()) {
      newSearchParams.set("keywords", keywords.trim());
    } else {
      newSearchParams.delete("keywords");
    }

    // 필터 파라미터 설정
    newSearchParams.set("category", selectedCategory);
    newSearchParams.set("maxDistance", maxDistance.toString());
    newSearchParams.set("minStar", minStar.toString());

    setSearchParams(newSearchParams);

    // URL 업데이트 후 fetchPlaces는 useEffect에 의해 자동으로 호출됨
    // fetchPlaces(); // 이 줄을 제거하여 중복 호출 방지
  };

  // 카테고리 선택 핸들러
  const handleCategoryClick = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setCurrentPage(1); // 카테고리 변경 시 첫 페이지로 리셋

    // URL 파라미터 업데이트
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("category", categoryKey);
    newSearchParams.set("page", "1");
    setSearchParams(newSearchParams);
  };

  // 위치 정보 초기화 핸들러
  const handleClearLocation = () => {
    setCurrentCoords(null);
    setMyLocation("위치를 가져오는 중...");

    // URL에서 x, y 파라미터 제거
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("x");
    newSearchParams.delete("y");
    setSearchParams(newSearchParams);
  };

  // 새 장소 등록 버튼 클릭 핸들러
  const handleNewPlaceClick = () => {
    navigate("/newplace");
  };

  // 컴포넌트 마운트 시 로그인 상태 확인
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

  // URL 파라미터 변경 시 좌표 state 동기화
  useEffect(() => {
    const x = searchParams.get("x");
    const y = searchParams.get("y");
    const coordsExist = !!(x && y);

    setHasCoordinates(coordsExist);

    if (coordsExist) {
      setCurrentCoords({ lat: parseFloat(y), lng: parseFloat(x) });
    } else {
      setCurrentCoords(null);
    }
  }, [searchParams]);

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
            {hasCoordinates && (
              <button
                className="clearLocationBtn"
                onClick={handleClearLocation}
              >
                위치 초기화
              </button>
            )}
          </p>
        </div>
      </header>

      <div className="container">
        {/* 키워드 검색 입력 필드 */}
        <div className="searchSection">
          <input
            type="text"
            className="searchInput"
            placeholder="검색어를 입력하세요 (장소 이름, 주소)"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
        </div>

        <ul className="categoryUl">
          {categories.map((category) => (
            <li
              key={category.key}
              data-category={category.key}
              className={selectedCategory === category.key ? "active" : ""}
              onClick={() => handleCategoryClick(category.key)}
            >
              {category.label}
            </li>
          ))}
          {userLoggedIn && (
            <button
              id="addNewPlaceBtn"
              type="button"
              onClick={handleNewPlaceClick}
            >
              새 장소
            </button>
          )}
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
                        {hasCoordinates && (
                          <span className="distance">{place.distance}m</span>
                        )}
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

      {/* 위치 선택 모달 */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onLocationSelect={handleLocationSelect}
        initialLocation={currentCoords || undefined}
      />
    </>
  );
};

export default AroundMe;
