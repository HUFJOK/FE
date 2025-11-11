import { apiClient } from "./client";
import type { UserResponse } from "./types";

export const getUser = async (): Promise<UserResponse> => {
  const response = await apiClient.get<UserResponse>("/api/v1/users/mypage/me");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post("/logout");
};
