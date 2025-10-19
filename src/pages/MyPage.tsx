import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isLoggedIn,
  getUserIdFromToken,
  getAuthHeaders,
  clearAuth,
} from "../utils/auth";
import { getApiUrl } from "../utils/config";
import "./MyPage.css";

// 비동기 이미지 URL 컴포넌트
const PlaceImage: React.FC<{ placeNo: number; alt: string }> = ({
  placeNo,
  alt,
}) => {
  const [imageUrl, setImageUrl] = useState("/images/180x240_placeholder.jpg");

  useEffect(() => {
    getApiUrl(`/api/image/${placeNo}_1.jpg`).then(setImageUrl);
  }, [placeNo]);

  return (
    <img
      className="placeImg"
      src={imageUrl}
      onError={(e) => {
        e.currentTarget.src = "/images/180x240_placeholder.jpg";
      }}
      alt={alt}
    />
  );
};

interface Place {
  no: number;
  title: string;
  category: string;
  guAddress: string;
  afterGuAddress: string;
  detailAddress: string;
  star: number;
  distance?: number;
  wished: boolean;
}

interface Review {
  no: number;
  userId: string;
  userNickname: string;
  placeNo: number;
  placeTitle: string;
  content: string;
  star: number;
  writtenDate: string;
}

interface WishlistResponse {
  wishlist: Place[];
}

interface PlacesResponse {
  places: {
    placeNo: number;
    name: string;
    star: number;
    distance: number;
    address: string;
  }[];
}

interface ReviewsResponse {
  reviews: Review[];
}

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("wishList");
  const [places, setPlaces] = useState<Place[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 로그인 확인
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  // 찜 목록 가져오기
  const fetchWishlist = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiUrl = await getApiUrl(`/api/users/${userId}/wishlist`);
      const response = await fetch(apiUrl, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
        }
        throw new Error("찜 목록을 불러오는데 실패했습니다.");
      }

      const data: WishlistResponse = await response.json();
      setPlaces(data.wishlist || []);
      setReviews([]);
    } catch (err) {
      console.error("찜 목록 조회 에러:", err);
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 내가 작성한 장소 가져오기
  const fetchMyPlaces = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiUrl = await getApiUrl(`/api/users/${userId}/places`);
      const response = await fetch(apiUrl, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
        }
        throw new Error("장소 목록을 불러오는데 실패했습니다.");
      }

      const data: PlacesResponse = await response.json();
      // API 응답을 Place 형식으로 변환
      const transformedPlaces: Place[] = (data.places || []).map((p) => ({
        no: p.placeNo,
        title: p.name,
        category: "", // API에서 제공하지 않음
        guAddress: p.address.split(" ").slice(0, 2).join(" "), // 주소에서 구 주소 추출
        afterGuAddress: p.address.split(" ").slice(2).join(" "), // 나머지 주소
        detailAddress: "",
        star: p.star,
        distance: p.distance,
        wished: false,
      }));
      setPlaces(transformedPlaces);
      setReviews([]);
    } catch (err) {
      console.error("장소 목록 조회 에러:", err);
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 내가 작성한 리뷰 가져오기
  const fetchMyReviews = async () => {
    const userId = getUserIdFromToken();
    if (!userId) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const apiUrl = await getApiUrl(`/api/users/${userId}/reviews`);
      const response = await fetch(apiUrl, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("인증에 실패했습니다. 다시 로그인해주세요.");
        }
        throw new Error("리뷰 목록을 불러오는데 실패했습니다.");
      }

      const data: ReviewsResponse = await response.json();
      setPlaces([]);
      setReviews(data.reviews || []);
    } catch (err) {
      console.error("리뷰 목록 조회 에러:", err);
      setError(
        err instanceof Error ? err.message : "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    switch (activeMenu) {
      case "wishList":
        fetchWishlist();
        break;
      case "myPlaces":
        fetchMyPlaces();
        break;
      case "reviews":
        fetchMyReviews();
        break;
      default:
        fetchWishlist();
    }
  }, [activeMenu]);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleWithdraw = async () => {
    const password = prompt("회원 탈퇴를 진행하려면 비밀번호를 입력해주세요:");

    if (!password) {
      return; // 취소한 경우
    }

    if (
      !confirm("정말 회원탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      return;
    }

    const userId = getUserIdFromToken();
    if (!userId) {
      alert("로그인 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      setLoading(true);
      const apiUrl = await getApiUrl(`/api/users/${userId}`);
      const response = await fetch(apiUrl, {
        method: "DELETE",
        headers: getAuthHeaders(),
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("회원 탈퇴가 완료되었습니다.");
        clearAuth(); // 인증 정보 삭제
        navigate("/");
      } else {
        alert(data.message || "회원 탈퇴에 실패했습니다.");
      }
    } catch (err) {
      console.error("회원 탈퇴 에러:", err);
      alert("회원 탈퇴 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getMenuTitle = () => {
    switch (activeMenu) {
      case "wishList":
        return "내가 찜한 장소";
      case "myPlaces":
        return "내 장소";
      case "reviews":
        return "내 리뷰";
      default:
        return "내가 찜한 장소";
    }
  };

  return (
    <>
      <header>
        <div className="container">
          <h1>마이페이지</h1>
        </div>
      </header>

      <div className="container">
        <aside className="sideLnb">
          <ul>
            <li
              className={activeMenu === "wishList" ? "active" : ""}
              onClick={() => handleMenuClick("wishList")}
            >
              내가 찜한 장소
            </li>
            <li
              className={activeMenu === "myPlaces" ? "active" : ""}
              onClick={() => handleMenuClick("myPlaces")}
            >
              내 장소
            </li>
            <li
              className={activeMenu === "reviews" ? "active" : ""}
              onClick={() => handleMenuClick("reviews")}
            >
              내 리뷰
            </li>
            <li className="withdraw" onClick={handleWithdraw}>
              회원탈퇴
            </li>
          </ul>
        </aside>

        <section className="content">
          <h3>{getMenuTitle()}</h3>
          <hr />

          {loading && (
            <p
              style={{ textAlign: "center", marginTop: "50px", color: "#666" }}
            >
              로딩 중...
            </p>
          )}

          {error && (
            <p
              style={{
                textAlign: "center",
                marginTop: "50px",
                color: "#e74c3c",
              }}
            >
              {error}
            </p>
          )}

          {!loading && !error && places.length > 0 && (
            <ul className="results">
              {places.map((place) => (
                <li key={place.no}>
                  <a href={`/place/${place.no}`}>
                    <PlaceImage placeNo={place.no} alt={place.title} />
                    <div>
                      <p>
                        <span className="placeName">{place.title}</span>
                        {place.distance !== undefined && (
                          <span className="distance">{place.distance}m</span>
                        )}
                      </p>
                      <p>
                        {place.guAddress} {place.afterGuAddress}{" "}
                        {place.detailAddress}
                      </p>
                      <p className="star">★ {place.star.toFixed(2)}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {!loading && !error && reviews.length > 0 && (
            <table className="reviews">
              <thead>
                <tr>
                  <th>장소 이름</th>
                  <th>내용</th>
                  <th>별점</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.no}>
                    <td>
                      <a href={`/place/${review.placeNo}`}>
                        {review.placeTitle}
                      </a>
                    </td>
                    <td className="review-content">{review.content}</td>
                    <td className="star">★ {review.star.toFixed(2)}</td>
                    <td>{new Date(review.writtenDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {!loading &&
            !error &&
            places.length === 0 &&
            reviews.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "50px",
                  color: "#666",
                }}
              >
                등록된 항목이 없습니다.
              </p>
            )}
        </section>
      </div>
    </>
  );
};

export default MyPage;
