import { apiClient } from "./client";
import type {
  HttpErrorResponse,
  MaterialCreateResponse,
  MaterialGetResponse,
  MaterialListResponse,
  MaterialRequest,
  MaterialUpdateRequest,
  MaterialUpdateResponse,
} from "./types";

// 특정 자료 상세 조희
export const getMaterial = async (
  materialId: number,
): Promise<MaterialGetResponse> => {
  const response = await apiClient.get<MaterialGetResponse>(
    `/api/v1/materials/${materialId}`,
  );
  return response.data;
};

// 자료 수정 (수정 필요)
export const updateMaterial = async (
  materialId: number,
  data: MaterialUpdateRequest,
): Promise<MaterialUpdateResponse> => {
  const response = await apiClient.put<MaterialUpdateResponse>(
    `/api/v1/materials/${materialId}`,
    data,
  );
  return response.data;
};

// 자료 삭제
export const deleteMaterial = async (materialId: number): Promise<void> => {
  await apiClient.delete(`/api/v1/materials/${materialId}`);
};

// 자료 게시물 목록 조회
export const getMaterials = async (params?: {
  keyword?: string;
  year?: number;
  semester?: number;
  sortBy?: "latest";
  page?: number;
}): Promise<MaterialListResponse> => {
  const safeParams = params || {};
  const response = await apiClient.get<MaterialListResponse>(
    "/api/v1/materials",
    {
      params: safeParams,
    },
  );
  return response.data;
};

// 새 자료 작성 및 파일 업로드
export const createMaterial = async (
  metadata: MaterialRequest,
  files: File[],
): Promise<MaterialCreateResponse> => {
  const formData = new FormData();

  // metadata(JSON) 추가
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], {
      type: "application/json",
    }),
  );

  // 파일 목록 추가
  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiClient.post<MaterialCreateResponse>(
    "/api/v1/materials",
    formData,
  );
  return response.data;
};

// 자료 파일 다운로드 (자료 구매)
export const downloadMaterial = async (
  materialId: number,
  attachmentId: number,
): Promise<{ blob: Blob; filename: string } | HttpErrorResponse> => {
  try {
    const response = await apiClient.get<Blob>(
      `/api/v1/materials/${materialId}/download/${attachmentId}`,
      {
        responseType: "blob",
      },
    );

    const contentDisposition = response.headers["content-disposition"];
    let filename = "downloaded_file";

    if (contentDisposition) {
      const filenameMatch = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameMatch.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, "");
        filename = decodeURIComponent(filename);
      }
    }

    return {
      blob: response.data,
      filename: filename,
    };
  } catch (error: any) {
    // 4xx 에러
    if (error.response && error.response.data instanceof Blob) {
      try {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText) as HttpErrorResponse;
        return errorJson;
      } catch (e) {
        // 파싱 실패 시 일반 에러
        return { error: "알 수 없는 다운로드 오류가 발생했습니다." };
      }
    }
    // 일반 네트워크 에러
    return { error: error.message || "네트워크 오류가 발생했습니다." };
  }
};
