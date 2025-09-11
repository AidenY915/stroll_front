import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { getApiUrl } from "../utils/config";
import "./NewPlace.css";

interface NewPlaceForm {
  placeName: string;
  address: string;
  detailAddress: string;
  content: string;
  category: string;
  imgs: File[];
}

interface NewPlaceFormErrors {
  placeName?: string;
  address?: string;
  detailAddress?: string;
  content?: string;
  category?: string;
  imgs?: string;
}

interface NewPlaceResponse {
  message: string;
  placeNo?: number;
}

const CATEGORIES = [
  { value: "restaurant", label: "음식점" },
  { value: "cafe", label: "카페" },
  { value: "hospital", label: "병원" },
  { value: "playground", label: "놀이터" },
  { value: "kindergarten", label: "유치원" },
  { value: "inn", label: "숙박" },
];

const NewPlace: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<NewPlaceForm>({
    placeName: "",
    address: "",
    detailAddress: "",
    content: "",
    category: "",
    imgs: [],
  });

  const [errors, setErrors] = useState<NewPlaceFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // 로그인하지 않은 상태라면 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  // Daum 우편번호 API 스크립트 로드
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거
      document.head.removeChild(script);
    };
  }, []);

  // 주소 검색 함수
  const handleAddressSearch = () => {
    // Daum 우편번호 서비스 객체가 로드되었는지 확인
    if (!(window as any).daum) {
      alert("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        // 도로명 주소 또는 지번 주소 선택
        const address =
          data.userSelectedType === "R" ? data.roadAddress : data.jibunAddress;

        setFormData((prev) => ({
          ...prev,
          address: address,
        }));

        // 주소 에러 메시지 제거
        if (errors.address) {
          setErrors((prev) => ({
            ...prev,
            address: undefined,
          }));
        }

        // 전역 메시지 제거
        if (message) {
          setMessage(null);
        }
      },
    }).open();
  };

  // 입력값 변경 처리
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 제거
    if (errors[name as keyof NewPlaceFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // 전역 메시지 제거
    if (message) {
      setMessage(null);
    }
  };

  // 이미지 파일 선택 처리
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 파일 개수 제한 (최대 5개)
    if (files.length > 5) {
      setErrors((prev) => ({
        ...prev,
        imgs: "이미지는 최대 5개까지 선택 가능합니다.",
      }));
      return;
    }

    // 파일 크기 및 타입 검증
    const validFiles: File[] = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          imgs: "JPG, PNG, GIF, WEBP 파일만 업로드 가능합니다.",
        }));
        return;
      }

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          imgs: "파일 크기는 5MB 이하여야 합니다.",
        }));
        return;
      }

      validFiles.push(file);
    }

    setFormData((prev) => ({
      ...prev,
      imgs: validFiles,
    }));

    // 이미지 미리보기 생성
    const previews: string[] = [];
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push(e.target?.result as string);
        if (previews.length === validFiles.length) {
          setImagePreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });

    // 에러 메시지 제거
    if (errors.imgs) {
      setErrors((prev) => ({
        ...prev,
        imgs: undefined,
      }));
    }
  };

  // 이미지 제거
  const removeImage = (index: number) => {
    const newImages = formData.imgs.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setFormData((prev) => ({
      ...prev,
      imgs: newImages,
    }));
    setImagePreviews(newPreviews);
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: NewPlaceFormErrors = {};

    // 장소명 검사
    if (!formData.placeName.trim()) {
      newErrors.placeName = "장소명을 입력해주세요.";
    } else if (formData.placeName.length > 100) {
      newErrors.placeName = "장소명은 100자 이하여야 합니다.";
    }

    // 주소 검사
    if (!formData.address.trim()) {
      newErrors.address = "주소를 입력해주세요.";
    } else if (formData.address.length > 200) {
      newErrors.address = "주소는 200자 이하여야 합니다.";
    }

    // 상세주소 검사
    if (formData.detailAddress.length > 100) {
      newErrors.detailAddress = "상세주소는 100자 이하여야 합니다.";
    }

    // 내용 검사
    if (!formData.content.trim()) {
      newErrors.content = "장소 설명을 입력해주세요.";
    } else if (formData.content.length < 10) {
      newErrors.content = "장소 설명은 최소 10자 이상 입력해주세요.";
    } else if (formData.content.length > 1000) {
      newErrors.content = "장소 설명은 1000자 이하여야 합니다.";
    }

    // 카테고리 검사
    if (!formData.category) {
      newErrors.category = "카테고리를 선택해주세요.";
    }

    // 이미지 검사
    if (formData.imgs.length === 0) {
      newErrors.imgs = "최소 1개의 이미지를 업로드해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 장소 등록 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = await getApiUrl("/api/place");

      // FormData 생성
      const formDataToSend = new FormData();

      // 이미지 파일들 추가
      formData.imgs.forEach((img) => {
        formDataToSend.append("imgs", img);
      });

      // 다른 필드들 추가
      formDataToSend.append("placeName", formData.placeName);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("detailAddress", formData.detailAddress);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("category", formData.category);

      const response = await fetch(apiUrl, {
        method: "POST",
        body: formDataToSend,
        // FormData 사용 시 Content-Type 헤더를 설정하지 않음 (브라우저가 자동으로 설정)
      });

      const data: NewPlaceResponse = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "장소가 성공적으로 등록되었습니다!",
        });

        // 성공 시 3초 후 홈으로 이동
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "장소 등록에 실패했습니다.",
        });
      }
    } catch (error) {
      console.error("장소 등록 에러:", error);
      setMessage({
        type: "error",
        text: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="newplace-container">
      <form className="newplace-form" onSubmit={handleSubmit}>
        <h2>새 장소 등록</h2>

        {message && (
          <div
            className={
              message.type === "success" ? "newplace-success" : "newplace-error"
            }
          >
            {message.text}
          </div>
        )}

        {/* 장소명 입력 */}
        <div className="form-group">
          <label htmlFor="placeName">장소명 *</label>
          <input
            type="text"
            id="placeName"
            name="placeName"
            value={formData.placeName}
            onChange={handleChange}
            className={errors.placeName ? "error" : ""}
            placeholder="장소명을 입력하세요"
            disabled={loading}
            maxLength={100}
          />
          {errors.placeName && (
            <div className="error-message">{errors.placeName}</div>
          )}
        </div>

        {/* 주소 입력 */}
        <div className="form-group">
          <label htmlFor="address">주소 *</label>
          <div className="address-input-group">
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={errors.address ? "error" : ""}
              placeholder="주소 검색 버튼을 클릭하세요"
              disabled={loading}
              maxLength={200}
              readOnly
            />
            <button
              type="button"
              className="address-search-button"
              onClick={handleAddressSearch}
              disabled={loading}
            >
              주소 검색
            </button>
          </div>
          {errors.address && (
            <div className="error-message">{errors.address}</div>
          )}
        </div>

        {/* 상세주소 입력 */}
        <div className="form-group">
          <label htmlFor="detailAddress">상세주소</label>
          <input
            type="text"
            id="detailAddress"
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            className={errors.detailAddress ? "error" : ""}
            placeholder="상세주소를 입력하세요 (선택사항)"
            disabled={loading}
            maxLength={100}
          />
          {errors.detailAddress && (
            <div className="error-message">{errors.detailAddress}</div>
          )}
        </div>

        {/* 카테고리 선택 */}
        <div className="form-group">
          <label htmlFor="category">카테고리 *</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "error" : ""}
            disabled={loading}
          >
            <option value="">카테고리를 선택하세요</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <div className="error-message">{errors.category}</div>
          )}
        </div>

        {/* 장소 설명 입력 */}
        <div className="form-group">
          <label htmlFor="content">장소 설명 *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className={errors.content ? "error" : ""}
            placeholder="장소에 대한 설명을 입력하세요 (최소 10자)"
            disabled={loading}
            rows={5}
            maxLength={1000}
          />
          <div className="char-count">{formData.content.length}/1000</div>
          {errors.content && (
            <div className="error-message">{errors.content}</div>
          )}
        </div>

        {/* 이미지 업로드 */}
        <div className="form-group">
          <label htmlFor="imgs">이미지 *</label>
          <input
            type="file"
            id="imgs"
            name="imgs"
            multiple
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className={errors.imgs ? "error" : ""}
            disabled={loading}
          />
          <div className="file-info">
            JPG, PNG, GIF, WEBP 파일, 최대 5개, 각 파일 5MB 이하
          </div>
          {errors.imgs && <div className="error-message">{errors.imgs}</div>}

          {/* 이미지 미리보기 */}
          {imagePreviews.length > 0 && (
            <div className="image-preview-container">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="image-preview">
                  <img src={preview} alt={`미리보기 ${index + 1}`} />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => removeImage(index)}
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="newplace-button" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? "등록 중..." : "장소 등록"}
        </button>

        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate("/")}
          disabled={loading}
        >
          취소
        </button>
      </form>
    </div>
  );
};

export default NewPlace;
