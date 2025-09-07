import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { setToken, setUser, isLoggedIn } from "../utils/auth";
import { getApiUrl } from "../utils/config";
import "./Login.css";

interface LoginForm {
  userId: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
  token: string;
  user: {
    userId: string;
    nickname: string;
    email?: string;
  };
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState<LoginForm>({
    userId: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Partial<LoginForm>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 이미 로그인된 상태라면 홈으로 리다이렉트
  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, [navigate]);

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // 에러 메시지 제거
    if (errors[name as keyof LoginForm]) {
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

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};

    if (!formData.userId.trim()) {
      newErrors.userId = "아이디를 입력해주세요.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "비밀번호를 입력해주세요.";
    } else if (formData.password.length < 4) {
      newErrors.password = "비밀번호는 최소 4자 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const apiUrl = await getApiUrl("/api/auth/login");
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: formData.userId,
          password: formData.password,
        }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        // 토큰과 사용자 정보 저장
        setToken(data.token);
        setUser(data.user);

        setMessage({ type: "success", text: "로그인 성공!" });

        // 이전 페이지로 이동하거나 홈으로 이동
        const from = (location.state as any)?.from?.pathname || "/";
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: data.message || "로그인에 실패했습니다.",
        });
      }
    } catch (error) {
      console.error("로그인 에러:", error);
      setMessage({
        type: "error",
        text: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>로그인</h2>

        {message && (
          <div
            className={
              message.type === "success" ? "login-success" : "login-error"
            }
          >
            {message.text}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="userId">아이디</label>
          <input
            type="text"
            id="userId"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={errors.userId ? "error" : ""}
            placeholder="아이디를 입력하세요"
            disabled={loading}
          />
          {errors.userId && (
            <div className="error-message">{errors.userId}</div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className={errors.password ? "error" : ""}
            placeholder="비밀번호를 입력하세요"
            disabled={loading}
          />
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
        </div>

        <div className="remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            checked={formData.rememberMe}
            onChange={handleChange}
            disabled={loading}
          />
          <label htmlFor="rememberMe">로그인 상태 유지</label>
        </div>

        <button type="submit" className="login-button" disabled={loading}>
          {loading && <span className="loading-spinner"></span>}
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <div className="forgot-password">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              alert("비밀번호 찾기 기능은 준비 중입니다.");
            }}
          >
            비밀번호를 잊으셨나요?
          </a>
        </div>

        <div className="register-link">
          아직 계정이 없으신가요?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/register");
            }}
          >
            회원가입
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
