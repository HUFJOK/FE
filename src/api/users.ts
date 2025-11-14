import { apiClient } from "./client";
import type {
  MaterialListResponse,
  OnboardingRequest,
  OnboardingResponse,
  PointHistoryResponse,
  PointRequest,
  PointResponse,
  UserResponse,
  UserUpdateRequest,
} from "./types";
import { formatDateTime } from "./utils";

/** 사용자 정보 관련 API */
// 기본 정보 조회
export const getUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>("/api/v1/users/mypage/me");
  return response.data;
};

// 기본 정보 변경
export const updateUser = async (
  data: UserUpdateRequest
): Promise<UserResponse> => {
  const response = await apiClient.put<UserResponse>(
    "/api/v1/users/mypage/me",
    data
  );
  return response.data;
};

// 전공 정보 입력
export const setOnboarding = async (
  data: OnboardingRequest
): Promise<OnboardingResponse> => {
  const response = await apiClient.post<OnboardingResponse>(
    "/api/v1/users/onboarding",
    data
  );
  return response.data;
};

/** 사용자 포인트 관련 API */
// 포인트 사용
export const usePoint = async (data: PointRequest): Promise<PointResponse> => {
  const response = await apiClient.post<PointResponse>(
    "/api/v1/users/mypage/points/use",
    data
  );

  response.data.createdAt = formatDateTime(response.data.createdAt);
  return response.data;
};

// 포인트 적립
export const earnPoint = async (data: PointRequest): Promise<PointResponse> => {
  const response = await apiClient.post<PointResponse>(
    "/api/v1/users/mypage/points/earn",
    data
  );

  response.data.createdAt = formatDateTime(response.data.createdAt);
  return response.data;
};

// 내 포인트 이력
export const getPointHistory = async (): Promise<PointHistoryResponse> => {
  const response = await apiClient.get<PointHistoryResponse>(
    "/api/v1/users/mypage/points/history"
  );

  const formattedData = response.data.map((historyItem) => ({
    ...historyItem,
    createdAt: formatDateTime(historyItem.createdAt),
  }));
  return formattedData;
};

// 내 포인트 잔액
export const getPoint = async (): Promise<PointResponse> => {
  const response = await apiClient.get<PointResponse>(
    "/api/v1/users/mypage/points/amount"
  );

  response.data.createdAt = formatDateTime(response.data.createdAt);
  return response.data;
};

/** 사용자 자료 목록 관련 API */
// 내가 올린 자료 목록 조희
export const getMyUploadedMaterials = async (
  page: number = 1
): Promise<MaterialListResponse> => {
  const response = await apiClient.get<MaterialListResponse>(
    "/api/v1/me/materials",
    {
      params: { page },
    }
  );
  return response.data;
};

// 내가 다운로드(구매)한 자료 목록 조희
export const getMyDownloadedMaterials = async (
  page: number = 1
): Promise<MaterialListResponse> => {
  const response = await apiClient.get<MaterialListResponse>(
    "/api/v1/me/downloads",
    {
      params: { page },
    }
  );
  return response.data;
};

// 사용자가 특정 자료를 구매했는지 확인
export const checkMyDownloadedMaterials = async (
  materialId: number
): Promise<boolean> => {
  const firstPage = await getMyDownloadedMaterials();
  if (firstPage.materials.some((m) => m.id === materialId)) {
    return true;
  }

  const { totalPages } = firstPage.pageInfo;
  if (totalPages > 1) {
    const pageNumbers = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
    const promises = pageNumbers.map((page) => getMyDownloadedMaterials(page));

    const subsequentPages = await Promise.all(promises);
    for (const page of subsequentPages) {
      if (page.materials.some((m) => m.id === materialId)) {
        return true;
      }
    }
  }

  return false;
};

/** 사용자 인증 관련 API */
// 로그아웃
export const logout = async (): Promise<void> => {
  await apiClient.post("/logout");
};
