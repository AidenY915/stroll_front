import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getApiUrl } from "../utils/config";
import "./Place.css";

// 인터페이스 정의
interface PlaceDetail {
  placeNo: number;
  name: string;
  content: string | null;
  createdAt: string;
  address: string;
  userId: string;
  distance: number;
  star: number;
  wished: boolean;
}

interface Review {
  userId: number;
  userNickname: string;
  content: string;
  star: number;
  createdAt: string;
}

interface PlaceDetailResponse extends PlaceDetail {
  imgs?: string[];
  replies?: Review[];
  currentUserId?: string;
}

const Place: React.FC = () => {
  const { placeNo } = useParams<{ placeNo: string }>();
  const [placeData, setPlaceData] = useState<PlaceDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [newReview, setNewReview] = useState({
    star: 3,
    content: "",
  });
  const [isWished, setIsWished] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  // 리뷰 데이터 가져오기
  const fetchReviews = async (placeId: number) => {
    try {
      const apiUrl = await getApiUrl(`/api/place/${placeId}/reviews`);
      const response = await fetch(apiUrl);
      if (response.ok) {
        const reviewData = await response.json();
        console.log("Reviews data:", reviewData);

        // 응답이 { reviews: [] } 형태인지 직접 배열인지 확인
        if (Array.isArray(reviewData)) {
          setReviews(reviewData);
        } else if (reviewData.reviews && Array.isArray(reviewData.reviews)) {
          setReviews(reviewData.reviews);
        } else {
          setReviews([]);
        }
      }
    } catch (error) {
      console.error("리뷰 데이터 로드 에러:", error);
    }
  };

  // 장소 상세 정보 가져오기
  useEffect(() => {
    const fetchPlaceDetail = async () => {
      try {
        setLoading(true);
        const apiUrl = await getApiUrl(`/api/place/${placeNo}`);
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error("장소 정보를 불러오는데 실패했습니다");
        }

        const data: PlaceDetailResponse = await response.json();
        console.log("Place data:", data);
        setPlaceData(data);
        setIsWished(data.wished);

        // 기본 이미지 설정
        if (data.imgs && data.imgs.length > 0) {
          setSelectedImage(data.imgs[0]);
        } else {
          // 기본 장소 이미지 시도
          setSelectedImage(`/images/${data.placeNo}_1.jpg`);
        }

        // 리뷰 데이터가 있다면 설정
        if (data.replies) {
          setReviews(data.replies);
        } else {
          // 리뷰 데이터를 별도로 가져오기
          fetchReviews(data.placeNo);
        }
      } catch (error) {
        console.error("API 호출 에러:", error);
      } finally {
        setLoading(false);
      }
    };

    if (placeNo) {
      fetchPlaceDetail();
    }
  }, [placeNo]);

  // 찜하기 토글
  const handleWishToggle = async () => {
    try {
      const apiUrl = await getApiUrl(`/api/wish/${placeNo}`);
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setIsWished(!isWished);
      }
    } catch (error) {
      console.error("찜하기 에러:", error);
    }
  };

  // 리뷰 작성
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.content.trim()) {
      alert("리뷰 내용을 입력해주세요.");
      return;
    }

    try {
      const apiUrl = await getApiUrl("/api/review");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          placeNo: Number(placeNo),
          star: newReview.star,
          content: newReview.content,
        }),
      });

      if (response.ok) {
        // 성공시 리뷰 목록 업데이트 및 폼 초기화
        setNewReview({ star: 3, content: "" });
        fetchReviews(Number(placeNo));
        alert("리뷰가 등록되었습니다.");
      } else {
        alert("리뷰 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 등록 에러:", error);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    }
  };

  // 리뷰 삭제
  const handleReviewDelete = async (reviewUserId: number) => {
    if (!confirm("리뷰를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const apiUrl = await getApiUrl(
        `/api/place/${placeNo}/review/${reviewUserId}`
      );
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchReviews(Number(placeNo));
        alert("리뷰가 삭제되었습니다.");
      } else {
        alert("리뷰 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("리뷰 삭제 에러:", error);
      alert("리뷰 삭제 중 오류가 발생했습니다.");
    }
  };

  // 장소 삭제
  const handlePlaceDelete = async () => {
    if (!confirm("장소를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const apiUrl = await getApiUrl(`/api/place/${placeNo}`);
      const response = await fetch(apiUrl, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("장소가 삭제되었습니다.");
        window.location.href = "/around";
      } else {
        alert("장소 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error("장소 삭제 에러:", error);
      alert("장소 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="place-container">
        <div style={{ textAlign: "center", padding: "50px" }}>로딩 중...</div>
      </div>
    );
  }

  if (!placeData) {
    return (
      <div className="place-container">
        <div style={{ textAlign: "center", padding: "50px" }}>
          장소 정보를 찾을 수 없습니다.
        </div>
      </div>
    );
  }

  const place = placeData;
  const { imgs, currentUserId } = placeData;

  return (
    <div className="place-container">
      <section className="about">
        <div className="imgSlider">
          {selectedImage && (
            <img
              className="displayedImg"
              src={selectedImage}
              alt={place.name}
              onError={(e) => {
                e.currentTarget.src = "/images/180x240_placeholder.jpg";
              }}
            />
          )}

          {imgs && imgs.length > 1 && (
            <div className="thumbnails">
              {imgs.map((img, index) => (
                <img
                  key={index}
                  className={`thumbnail ${
                    selectedImage === img ? "active" : ""
                  }`}
                  src={img}
                  alt={`${place.name} 이미지 ${index + 1}`}
                  onClick={() => setSelectedImage(img)}
                  onError={(e) => {
                    e.currentTarget.src = "/images/180x240_placeholder.jpg";
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <article>
          <h2>
            {place.name}
            {currentUserId && (
              <button className="wishBtn" onClick={handleWishToggle}>
                <img
                  src={
                    isWished ? "/images/wished.png" : "/images/beforeWish.png"
                  }
                  alt={isWished ? "찜 해제" : "찜하기"}
                />
              </button>
            )}
          </h2>
          <p>★ {place.star}</p>
          <p>
            <span>{place.address}</span>
          </p>
          <p>{place.content || "상세 설명이 없습니다."}</p>

          {currentUserId === place.userId && (
            <button className="deletePlaceBtn" onClick={handlePlaceDelete}>
              장소 삭제
            </button>
          )}
        </article>
      </section>

      <section className="reviewSection">
        {currentUserId && (
          <form className="commentWritingForm" onSubmit={handleReviewSubmit}>
            <select
              value={newReview.star}
              onChange={(e) =>
                setNewReview({ ...newReview, star: Number(e.target.value) })
              }
            >
              <option value={1}>★</option>
              <option value={2}>★★</option>
              <option value={3}>★★★</option>
              <option value={4}>★★★★</option>
              <option value={5}>★★★★★</option>
            </select>
            <textarea
              value={newReview.content}
              onChange={(e) =>
                setNewReview({ ...newReview, content: e.target.value })
              }
              placeholder="리뷰를 작성해주세요..."
            />
            <button type="submit" className="replyBtn">
              등록
            </button>
          </form>
        )}

        <ul className="reviews">
          {reviews.map((reply, index) => (
            <li key={`${reply.userId}-${index}`} className="review">
              <p className="writer">{reply.userNickname}</p>
              <p className="score">{"★".repeat(Math.floor(reply.star))}</p>
              <p className="content">{reply.content}</p>
              <p className="createdDate">
                {new Date(reply.createdAt).toLocaleDateString()}
              </p>
              {reply.userId.toString() === currentUserId && (
                <button
                  className="replyBtn"
                  onClick={() => handleReviewDelete(reply.userId)}
                >
                  삭제
                </button>
              )}
            </li>
          ))}
          {reviews.length === 0 && (
            <li style={{ textAlign: "center", padding: "20px", color: "#666" }}>
              아직 리뷰가 없습니다.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default Place;
