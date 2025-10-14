// 토큰 관리를 위한 유틸리티 함수들

const TOKEN_KEY = "stroll_token";
const USER_KEY = "stroll_user";

// 토큰 저장
export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

// 토큰 가져오기
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

// 토큰 제거
export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// 사용자 정보 저장
export const setUser = (user: any): void => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// 사용자 정보 가져오기
export const getUser = (): any | null => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

// 토큰 유효성 검사 (간단한 형태)
export const isTokenValid = (): boolean => {
  const token = getToken();
  if (!token) return false;

  try {
    // JWT 형식 확인
    const parts = token.split(".");
    if (parts.length !== 3) {
      // JWT가 아닌 경우 토큰이 존재하면 유효한 것으로 간주
      return true;
    }

    // JWT 토큰의 경우 payload 부분을 디코딩하여 만료시간 확인
    const payload = JSON.parse(atob(parts[1]));

    // exp 필드가 있으면 만료 시간 확인
    if (payload.exp) {
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    }

    // exp 필드가 없으면 유효한 것으로 간주
    return true;
  } catch (error) {
    // 파싱 에러 시 토큰이 존재하면 유효한 것으로 간주
    return true;
  }
};

// 인증된 요청을 위한 헤더 생성
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// 인증 정보 제거 (로그아웃과 비슷하지만 리다이렉션 없음)
export const clearAuth = (): void => {
  removeToken();
};

// 로그아웃
export const logout = (): void => {
  removeToken();
  // 페이지 새로고침 또는 홈으로 이동
  window.location.href = "/";
};

// JWT 토큰에서 사용자 ID(sub) 추출
export const getUserIdFromToken = (): string | null => {
  const token = getToken();
  if (!token) return null;

  console.log("저장된 토큰:", token); // 디버깅용

  try {
    // JWT 형식 확인 (3개 파트로 구성: header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("JWT 형식이 아닙니다. 토큰을 그대로 userId로 사용합니다.");
      // JWT가 아닌 경우 토큰 자체를 userId로 사용 (단순 문자열 토큰)
      return token;
    }

    // JWT 토큰의 payload 부분을 디코딩
    const payload = JSON.parse(atob(parts[1]));
    console.log("JWT payload:", payload); // 디버깅용
    // sub, userId, id 등 여러 필드명 시도
    return payload.sub || payload.userId || payload.id || null;
  } catch (error) {
    console.error("토큰 파싱 에러:", error);
    // 파싱 실패 시 토큰 자체를 userId로 사용
    return token;
  }
};

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return getToken() !== null && isTokenValid();
};
