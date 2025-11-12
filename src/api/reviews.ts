import { apiClient } from "./client";
import type {
  ReviewCreateRequest,
  ReviewCreateResponse,
  ReviewResponse,
  ReviewUpdateRequest,
} from "./types";
import { formatDateTime } from "./utils";

// 리뷰 단건 조희
export const getReview = async (reviewId: number): Promise<ReviewResponse> => {
  const response = await apiClient.get<ReviewResponse>(
    `/api/v1/reviews/${reviewId}`,
  );

  response.data.createdAt = formatDateTime(response.data.createdAt);
  return response.data;
};

// 리뷰 수정
export const updateReview = async (
  reviewId: number,
  data: ReviewUpdateRequest,
): Promise<void> => {
  await apiClient.put(`/api/v1/reviews/${reviewId}`, data);
};

// 리뷰 삭제
export const deleteReview = async (reviewId: number): Promise<void> => {
  await apiClient.delete(`/api/v1/reviews/${reviewId}`);
};

// 리뷰 작성
export const createReview = async (
  data: ReviewCreateRequest,
): Promise<ReviewCreateResponse> => {
  const response = await apiClient.post<ReviewCreateResponse>(
    "/api/v1/reviews",
    data,
  );

  response.data.createdAt = formatDateTime(response.data.createdAt);
  return response.data;
};

// 자료별 리뷰 전체 조회
export const getReviews = async (
  materialId: number,
): Promise<ReviewResponse[]> => {
  const response = await apiClient.get<ReviewResponse[]>(
    `/api/v1/materials/${materialId}/reviews`,
  );

  const formattedData = response.data.map((review) => ({
    ...review,
    createdAt: formatDateTime(review.createdAt),
  }));
  return formattedData;
};
