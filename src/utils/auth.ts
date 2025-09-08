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
    // JWT 토큰의 경우 payload 부분을 디코딩하여 만료시간 확인
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;

    return payload.exp > currentTime;
  } catch (error) {
    // JWT가 아닌 경우 또는 파싱 에러 시 토큰이 존재하면 유효한 것으로 간주
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

// 로그아웃
export const logout = (): void => {
  removeToken();
  // 페이지 새로고침 또는 홈으로 이동
  window.location.href = "/";
};

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return getToken() !== null && isTokenValid();
};

