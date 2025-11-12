// 공통
export interface PageInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

// users.ts
export interface UserResponse {
  nickname: string;
  major: string;
  minor: string | null;
  email: string;
  onboarding: boolean;
}

export interface UserUpdateRequest {
  nickname: string;
  major: string;
  minor: string | null;
}

export interface OnboardingRequest {
  major: string;
  minor: string | null;
}

export type OnboardingResponse = OnboardingRequest;

export interface PointRequest {
  amount: number;
  reason: string;
}

export interface PointResponse {
  amount: number;
  reason: string;
  createdAt: string;
  email: string;
}

export type PointHistoryResponse = PointResponse[];

// reviews.ts
export interface ReviewResponse {
  reviewId: number;
  authorNickname: string;
  reviewerEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: boolean;
}

export interface ReviewUpdateRequest {
  rating: number;
  comment: string;
}

export interface ReviewCreateRequest {
  materialId: number;
  comment: string;
  rating: number;
}

export interface ReviewCreateResponse {
  reviewId: number;
  authorNickname: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// materials.ts
export interface AttachmentDto {
  id: number;
  originalFileName: string;
  storedFilePath: string;
}

export interface MaterialGetResponse {
  materialId: number;
  title: string;
  year: number;
  semester: number;
  professorName: string;
  grade: string;
  courseDivision: string;
  courseName: string;
  description: string;
  authorName: string;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  avgRating: number;
  reviewCount: number;
  downloadCount: number;
  attachments: AttachmentDto[];
}

export interface MaterialRequest {
  title: string;
  year: number;
  semester: number;
  professorName: string;
  grade: string;
  courseDivision: string;
  courseName: string;
  description: string;
}

export interface MaterialUpdateResponse {
  id: number;
  title: string;
  year: number;
  semester: number;
  professorName: string;
  grade: string;
  courseDivision: string;
  courseName: string;
  description: string;
  updatedAt: string;
}

export interface MaterialSummary {
  id: number;
  title: string;
  year: number;
  semester: number;
  professorName: string;
  grade: string;
  courseDivision: string;
}

export interface MaterialListResponse {
  pageInfo: PageInfo;
  materials: MaterialSummary[];
}

export interface MaterialCreateResponse {
  materialId: number;
  title: string;
  year: number;
  semester: number;
  professorName: string;
  grade: string;
  courseDivision: string;
  courseName: string;
  description: string;
  createdAt: string;
  earnedPoints: number;
  currentPoints: number;
  pointMessage: string;
}

export interface HttpErrorResponse {
  error: string;
}
