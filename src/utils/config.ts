// 설정 파일 로드를 위한 유틸리티

interface Config {
  API_BASE_URL: string;
}

let config: Config | null = null;

// 설정 로드 함수
export const loadConfig = async (): Promise<Config> => {
  if (config) {
    return config;
  }

  try {
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error("Failed to load config");
    }
    config = await response.json();
    return config as Config;
  } catch (error) {
    console.error("Failed to load config, using default values:", error);
    // 기본값 사용
    config = {
      API_BASE_URL: "http://localhost:8080",
    };
    return config;
  }
};

// API Base URL 가져오기
export const getApiBaseUrl = async (): Promise<string> => {
  const config = await loadConfig();
  return config.API_BASE_URL;
};

// 전체 API URL 생성
export const getApiUrl = async (endpoint: string): Promise<string> => {
  const baseUrl = await getApiBaseUrl();
  // endpoint가 /로 시작하지 않으면 추가
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;
  return `${baseUrl}${normalizedEndpoint}`;
};
