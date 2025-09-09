import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";
import { getApiUrl } from "../utils/config";
import "./Register.css";

interface RegisterForm {
  userId: string;
  password: string;
  confirmPassword: string;
  nickname: string;
  email: string;
}

interface RegisterResponse {
  message: string;
  user?: {
    userId: string;
    nickname: string;
    email: string;
  };
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<RegisterForm>({
    userId: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    email: "",
  });

  const [errors, setErrors] = useState<Partial<RegisterForm>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ID 중복검사 관련 상태
  const [idCheckLoading, setIdCheckLoading] = useState(false);
  const [idCheckResult, setIdCheckResult] = useState<{
    checked: boolean;
    available: boolean;
    message: string;
  }>({
    checked: false,
    available: false,
    message: "",
  });

  // 이미 로그인된 상태라면 홈으로 리다이렉트
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 에러 메시지 제거
    if (errors[name as keyof RegisterForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }

    // ID가 변경되면 중복검사 결과 초기화
    if (name === "userId") {
      setIdCheckResult({
        checked: false,
        available: false,
        message: "",
      });
    }

    // 전역 메시지 제거
    if (message) {
      setMessage(null);
    }
  };

  // ID 중복검사
  const handleIdCheck = async () => {
    if (!formData.userId.trim()) {
      setErrors((prev) => ({
        ...prev,
        userId: "아이디를 입력해주세요.",
      }));
      return;
    }

    // ID 형식 검사
    const idPattern = /^[a-zA-Z0-9_]{4,20}$/;
    if (!idPattern.test(formData.userId)) {
      setErrors((prev) => ({
        ...prev,
        userId: "아이디는 4-20자의 영문, 숫자, 언더스코어만 사용 가능합니다.",
      }));
      return;
    }

    setIdCheckLoading(true);
    setIdCheckResult({
      checked: false,
      available: false,
      message: "",
    });

    try {
      const apiUrl = await getApiUrl(`/api/auth/check-id/${formData.userId}`);
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setIdCheckResult({
          checked: true,
          available: data.available,
          message: data.available
            ? "사용 가능한 아이디입니다."
            : "이미 사용중인 아이디입니다.",
        });
      } else {
        setIdCheckResult({
          checked: true,
          available: false,
          message: data.message || "중복검사 중 오류가 발생했습니다.",
        });
      }
    } catch (error) {
      console.error("ID 중복검사 에러:", error);
      setIdCheckResult({
        checked: true,
        available: false,
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIdCheckLoading(false);
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = {};

    // ID 검사
    if (!formData.userId.trim()) {
      newErrors.userId = "아이디를 입력해주세요.";
    } else if (!/^[a-zA-Z0-9_]{4,20}$/.test(formData.userId)) {
      newErrors.userId =
        "아이디는 4-20자의 영문, 숫자, 언더스코어만 사용 가능합니다.";
    } else if (!idCheckResult.checked) {
      newErrors.userId = "아이디 중복검사를 해주세요.";
    } else if (!idCheckResult.available) {
      newErrors.userId = "사용할 수 없는 아이디입니다.";
    }

    // 비밀번호 검사
    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 8) {
      newErrors.password = "비밀번호는 최소 8자 이상이어야 합니다.";
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "비밀번호는 영문과 숫자를 포함해야 합니다.";
    }

    // 비밀번호 확인 검사
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "비밀번호 확인을 입력해주세요.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    }

    // 닉네임 검사
    if (!formData.nickname.trim()) {
      newErrors.nickname = "닉네임을 입력해주세요.";
    } else if (formData.nickname.length < 2 || formData.nickname.length > 10) {
      newErrors.nickname = "닉네임은 2-10자 사이여야 합니다.";
    }

    // 이메일 검사
    if (!formData.email.trim()) {
      newErrors.email = "이메일을 입력해주세요.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "올바른 이메일 형식을 입력해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 회원가입 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = await getApiUrl("/api/auth/register");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
          nickname: formData.nickname,
          email: formData.email,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "회원가입이 완료되었습니다!" });

        // 성공 시 3초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "회원가입에 실패했습니다.",
        });
      }
    } catch (error) {
      console.error("회원가입 에러:", error);
      setMessage({
        type: "error",
        text: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h2>회원가입</h2>

        {message && (
          <div
            className={
              message.type === "success" ? "register-success" : "register-error"
            }
          >
            {message.text}
          </div>
        )}

        {/* 아이디 입력 */}
        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <div className="id-input-group">
            <input
              type="text"
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className={errors.userId ? "error" : ""}
              placeholder="4-20자의 영문, 숫자, 언더스코어"
              disabled={loading}
            />
            <button
              type="button"
              className="id-check-button"
              onClick={handleIdCheck}
              disabled={loading || idCheckLoading || !formData.userId.trim()}
            >
              {idCheckLoading ? "확인중..." : "중복검사"}
            </button>
          </div>
          {errors.userId && (
            <div className="error-message">{errors.userId}</div>
          )}
          {idCheckResult.checked && (
            <div
              className={
                idCheckResult.available ? "success-message" : "error-message"
              }
            >
              {idCheckResult.message}
            </div>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? "error" : ""}
            placeholder="8자 이상, 영문과 숫자 포함"
            disabled={loading}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        {/* 비밀번호 확인 */}
        <div className="form-group">
          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? "error" : ""}
            placeholder="비밀번호를 다시 입력하세요"
            disabled={loading}
          />
          {errors.confirmPassword && (
            <div className="error-message">{errors.confirmPassword}</div>
          )}
        </div>

        {/* 닉네임 입력 */}
        <div className="form-group">
          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            className={errors.nickname ? "error" : ""}
            placeholder="2-10자 사이의 닉네임"
            disabled={loading}
          />
          {errors.nickname && (
            <div className="error-message">{errors.nickname}</div>
          )}
        </div>

        {/* 이메일 입력 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? "error" : ""}
            placeholder="example@email.com"
            disabled={loading}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>

        <button type="submit" className="register-button" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? "가입 중..." : "회원가입"}
        </button>

        <div className="login-link">
          이미 계정이 있으신가요?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
          >
            로그인
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;
