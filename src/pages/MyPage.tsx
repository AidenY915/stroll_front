import React, { useState, useEffect } from "react";
import "./MyPage.css";

interface Place {
  no: number;
  title: string;
  address: string;
  detailAddress: string;
  star: number;
  distance?: number;
}

interface Review {
  placeNo: number;
  placeTitle: string;
  content: string;
  star: number;
  writtenDate: string;
}

const MyPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState("wishList");
  const [places, setPlaces] = useState<Place[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // 더미 데이터
  const wishListData: Place[] = [
    {
      no: 1,
      title: "강아지 카페 멍멍",
      address: "서울시 강남구",
      detailAddress: "테헤란로 123",
      star: 4.5,
    },
    {
      no: 2,
      title: "반려동물 놀이터",
      address: "서울시 서초구",
      detailAddress: "서초대로 456",
      star: 4.2,
    },
  ];

  const myPlacesData: Place[] = [
    {
      no: 3,
      title: "내가 등록한 펜션",
      address: "경기도 가평군",
      detailAddress: "가평읍 789",
      star: 4.8,
    },
  ];

  const reviewsData: Review[] = [
    {
      placeNo: 1,
      placeTitle: "강아지 카페 멍멍",
      content: "정말 좋은 곳이에요! 강아지들이 너무 귀여워요.",
      star: 5,
      writtenDate: "2024-01-15 14:30",
    },
    {
      placeNo: 2,
      placeTitle: "반려동물 놀이터",
      content: "넓고 깨끗해서 강아지가 뛰어놀기 좋아요.",
      star: 4,
      writtenDate: "2024-01-10 16:45",
    },
  ];

  useEffect(() => {
    switch (activeMenu) {
      case "wishList":
        setPlaces(wishListData);
        setReviews([]);
        break;
      case "myPlaces":
        setPlaces(myPlacesData);
        setReviews([]);
        break;
      case "reviews":
        setPlaces([]);
        setReviews(reviewsData);
        break;
      default:
        setPlaces(wishListData);
        setReviews([]);
    }
  }, [activeMenu]);

  const handleMenuClick = (menu: string) => {
    setActiveMenu(menu);
  };

  const handleWithdraw = () => {
    if (window.confirm("정말 회원탈퇴를 하시겠습니까?")) {
      alert("회원탈퇴가 완료되었습니다.");
      // 실제로는 서버에 탈퇴 요청을 보내고 로그아웃 처리
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

          {places.length > 0 && (
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
                        {place.address} {place.detailAddress}
                      </p>
                      <p className="star">★ {place.star}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}

          {reviews.length > 0 && (
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
                {reviews.map((review, index) => (
                  <tr key={index}>
                    <td>
                      <a href={`/detail/${review.placeNo}`}>
                        {review.placeTitle}
                      </a>
                    </td>
                    <td className="review-content">{review.content}</td>
                    <td className="star">★{review.star}</td>
                    <td>{review.writtenDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {places.length === 0 && reviews.length === 0 && (
            <p
              style={{ textAlign: "center", marginTop: "50px", color: "#666" }}
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
