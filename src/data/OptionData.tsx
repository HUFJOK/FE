export interface Option {
  index: number;
  value: string;
}

// 전공 옵션
export const MajorOptions: Option[] = [
  { index: 1, value: "철학과" },
  { index: 2, value: "사학과" },
  { index: 3, value: "언어인지과학과" },
  { index: 4, value: "Global Business & Technology 학부" },
  { index: 5, value: "국제금융학과" },
  { index: 6, value: "수학과" },
  { index: 7, value: "통계학과" },
  { index: 8, value: "전자물리학과" },
  { index: 9, value: "환경학과" },
  { index: 10, value: "생명공학과" },
  { index: 11, value: "화학과" },
  { index: 12, value: "컴퓨터공학부" },
  { index: 13, value: "정보통신공학과" },
  { index: 14, value: "반도체전자공학부" },
  { index: 15, value: "산업경영공학과" },
  { index: 16, value: "바이오메디컬공학부" },
  { index: 17, value: "디지털콘텐츠학부" },
  { index: 18, value: "투어리즘 & 웰니스학부" },
  { index: 19, value: "글로벌스포츠산업학부" },
  { index: 20, value: "AI데이터융합학부" },
  { index: 21, value: "Finance & AI융합학부" },
  { index: 22, value: "폴란드학과" },
  { index: 23, value: "루마니아학과" },
  { index: 24, value: "체코·슬로바키아학과" },
  { index: 25, value: "헝가리학과" },
  { index: 26, value: "세르비아·크로아티아학과" },
  { index: 27, value: "그리스·불가리아학과" },
  { index: 28, value: "중앙아시아학과" },
  { index: 29, value: "아프리카학부" },
  { index: 30, value: "우크라이나학과" },
  { index: 31, value: "한국학과" },
  { index: 32, value: "자유전공학부(글로벌)" },
  { index: 33, value: "기후변화융합학부" },
  { index: 34, value: "없음" },
];

// 연도 옵션
const currentYear = new Date().getFullYear();
export const YearOptions: Option[] = Array.from({ length: 11 }, (_, i) => {
  const year = currentYear - i;

  return {
    index: i,
    value: String(year),
  };
});

// 학기 옵션
export const SemesterOptions: Option[] = [
  { index: 0, value: "1" },
  { index: 1, value: "2" },
];

// 학년 옵션
export const GradeOptions: Option[] = [
  { index: 0, value: "1학년" },
  { index: 1, value: "2학년" },
  { index: 2, value: "3학년" },
  { index: 3, value: "4학년" },
];

// 구분 옵션
export const CategoryOptions: Option[] = [
  { index: 0, value: "전공" },
  { index: 1, value: "교양" },
  { index: 2, value: "기초" },
];
