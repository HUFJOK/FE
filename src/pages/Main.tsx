import React, { useMemo, useState } from "react";
import { BiSearch, BiChevronDown, BiChevronUp, BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Option } from "../data/OptionData";
import { MajorOptions } from "../data/OptionData";

type DocItem = {
  id: number;
  title: string;
  semester: string;
  grade: string;
  major: string;
  professor: string;
  type: string;
  downloads: number;
  reviews: number;
};

const sample: DocItem[] = [
  { id: 1, title: "2025-1 기계학습 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 125, reviews: 10 },
  { id: 2, title: "2025-1 알고리즘 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 122, reviews: 15 },
  { id: 3, title: "2025-1 알고리즘 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 127, reviews: 20 },
  { id: 4, title: "2025-1 기계학습 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 126, reviews: 25 },
];

const SEMESTER_OPTIONS = ["25-2","25-1","24-2","24-1","23-2","23-1","22-2","22-1","21-2","21-1","20-2","20-1"];
const GRADE_OPTIONS = ["1학년","2학년","3학년","4학년"];

/** 공통 칩 */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="
        inline-flex items-center justify-center
        h-[36px] px-[18px] rounded-[18px] border-2
        font-[Pretendard] text-[16px] font-semibold tracking-[-0.3px]
        bg-white text-primary-600 border-primary-600
      "
    >
      {children}
    </button>
  );
}

/** 필터 트리거 (디자인 반영) */
function FilterTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center justify-center
        w-[77px] h-[36px] px-[18px] py-[7px]
        rounded-[20px] bg-primary-500 text-gray-100
        font-[Pretendard] text-[16px] font-normal
        leading-[140%] tracking-[-0.4px]
        hover:brightness-110 active:translate-y-[1px]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30
      "
      aria-haspopup="dialog"
      aria-expanded="true"
    >
      필터링
    </button>
  );
}

/** 문서 카드 */
function DocCard({ item, onClick }: { item: DocItem; onClick: () => void }) {
  return (
    <article
      onClick={onClick}
      className="
        w-full box-border rounded-[12px] bg-white px-[28px] py-[18px]
        border-2 border-primary-600 cursor-pointer
        transition hover:shadow-sm
      "
    >
      <div className="flex items-start">
        <div className="flex-1 min-w-0">
          <h3 className="font-[Pretendard] text-[24px] font-extrabold tracking-[-0.6px] text-[#232323] mb-[8px]">
            {item.title}
          </h3>
          <p className="font-[Pretendard] text-[14px] font-semibold tracking-[-0.2px] text-[#5B5B5B]">
            {item.semester} &nbsp; {item.grade} &nbsp; {item.major} &nbsp;
            {item.professor} &nbsp; {item.type}
          </p>
        </div>
        <div className="ml-[16px] shrink-0 text-right font-[Pretendard] text-[14px] font-semibold text-[#5B5B5B]">
          <div>다운로드 {item.downloads}회</div>
          <div>리뷰 {item.reviews}개</div>
        </div>
      </div>
    </article>
  );
}

export default function MainContent(): React.JSX.Element {
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // 정렬 상태
  const [sortLabel, setSortLabel] = useState<"추천순" | "다운로드순" | "최신순">("추천순");

  // 필터 상태 (칩에 반영)
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Option | null>(null);
  const [selectprofessor, setProfessor] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 검색 + 정렬
  const filteredSorted = useMemo(() => {
    let arr = !q.trim()
      ? [...sample]
      : sample.filter((s) => s.title.includes(q.trim()));

    switch (sortLabel) {
      case "추천순":
        arr.sort((a, b) => (b.reviews - a.reviews) || (b.downloads - a.downloads));
        break;
      case "다운로드순":
        arr.sort((a, b) => b.downloads - a.downloads);
        break;
      case "최신순":
        arr.sort((a, b) => b.id - a.id);
        break;
    }
    return arr;
  }, [q, sortLabel]);

  return (
    <section className="relative max-w-[1120px] mx-auto px-4 pt-[28px] pb-[60px]">
      {/* 올리기 버튼 */}
      <div className="absolute right-0 top-[20px]">
        <button
          type="button"
          onClick={() => navigate("../data/upload")}
          className="
            inline-flex items-center justify-center gap-[10px]
            min-w-[93px] h-[38px] px-[23.5px]
            rounded-[12px] bg-primary-600 text-white
            font-[Pretendard] text-[18px] font-semibold leading-[140%] tracking-[-0.45px]
            transition hover:brightness-110 active:translate-y-[1px]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30
          "
        >
          올리기
        </button>
      </div>

      {/* 검색창 */}
      <div className="flex justify-center mt-[60px] mb-[16px]">
        <div
          className="
            flex justify-between items-center shrink-0
            w-[770px] h-[63px] p-[20px]
            rounded-[8px] border-2 bg-gray-100 border-primary-600
          "
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어를 입력해 주세요."
            className="
              w-full bg-transparent outline-none
              font-[Pretendard] font-semibold
              text-[18px] leading-[140%] tracking-[-0.45px]
              text-gray-400 placeholder-gray-400
            "
          />
          <BiSearch size={23} color="#5F372F" className="ml-[12px] shrink-0" />
        </div>
      </div>

      {/* 필터 + 칩 */}
      <div className="flex items-center justify-center gap-[10px] mb-[24px]">
        <FilterTrigger onClick={() => setFilterOpen(true)} />
        <Chip>{selectedSemester ?? "학기"}</Chip>
        <Chip>{selectedGrade ?? "학년"}</Chip>
        <Chip>{selectedMajor?.value ?? "전공"}</Chip>
        <Chip>{selectprofessor || "교수"}</Chip>
        <Chip>{selectedCategory ?? "구분"}</Chip>
      </div>

      {/* 정렬 드롭다운 */}
      <div className="flex items-center justify-between mb-[18px]">
        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((s) => !s)}
            className="
              inline-flex items-center gap-[6px]
              h-[34px] px-[12px] rounded-[8px] border-2 bg-white
              font-[Pretendard] text-[14px] font-semibold
              border-primary-600 text-primary-600
            "
          >
            {sortLabel} {sortOpen ? <BiChevronUp /> : <BiChevronDown />}
          </button>

          {sortOpen && (
            <div
              className="
                absolute z-10 mt-2 w-[120px] rounded-[10px] border-2 bg-white
                shadow-sm overflow-hidden border-primary-600
              "
            >
              {(["추천순", "다운로드순", "최신순"] as const).map((it) => (
                <button
                  key={it}
                  className="w-full text-left px-3 py-2 hover:bg-primary-100 font-[Pretendard] text-[14px] font-semibold text-primary-600"
                  onClick={() => {
                    setSortLabel(it);
                    setSortOpen(false);
                  }}
                >
                  {it}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 리스트 */}
      <div className="flex flex-col gap-[16px]">
        {filteredSorted.map((item) => (
          <DocCard
            key={item.id}
            item={item}
            onClick={() => navigate("/data/detail")}
          />
        ))}
      </div>

      {/* ===== 필터 팝업 ===== */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          {/* dim */}
          <button className="absolute inset-0 bg-black/30" onClick={() => setFilterOpen(false)} aria-label="닫기 배경" />

          {/* panel */}
          <div
            className="
              relative w-[343px] h-[530px]
              rounded-[12px] bg-[#F6F1ED]
              p-[25px] shadow-md
              flex flex-col gap-[15px]
            "
          >
            {/* 닫기 */}
            <button
              type="button"
              className="absolute right-[16px] top-[12px] p-1"
              onClick={() => setFilterOpen(false)}
              aria-label="닫기"
            >
              <BiX size={24} color="#5F372F" />
            </button>

            {/* 학기 */}
            <div className="flex flex-col gap-[3px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">학기</div>
              <div className="flex flex-wrap gap-[10px]">
                {SEMESTER_OPTIONS.map((v) => {
                  const active = selectedSemester === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedSemester(v)}
                      className={`
                        h-[28px] px-[12px] rounded-[14px] border-2 text-[14px] font-[Pretendard]
                        ${active ? "bg-primary-600 text-white" : "bg-white text-primary-600"}
                        border-primary-600
                      `}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 학년 */}
            <div className="flex flex-col gap-[3px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">학년</div>
              <div className="flex gap-[10px]">
                {GRADE_OPTIONS.map((v) => {
                  const active = selectedGrade === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedGrade(v)}
                      className={`
                        h-[28px] px-[12px] rounded-[14px] border-2 text-[14px] font-[Pretendard]
                        ${active ? "bg-primary-600 text-white" : "bg-white text-primary-600"}
                        border-primary-600
                      `}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 전공 */}
            <div className="flex flex-col gap-[3px]">
              <label className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">전공</label>
              <div className="relative">
                <select
                  value={selectedMajor?.index ?? ""}
                  onChange={(e) => {
                    const idx = Number(e.target.value);
                    const found = MajorOptions.find((m) => m.index === idx) || null;
                    setSelectedMajor(found);
                  }}
                  className="
                    w-full h-[40px] rounded-[12px] border-2 bg-white px-[12px]
                    font-[Pretendard] text-[14px] font-semibold
                    focus:outline-none appearance-none
                    border-primary-600 text-gray-700
                  "
                >
                  <option value="" className="text-gray-400">선택</option>
                  {MajorOptions.map((opt) => (
                    <option key={opt.index} value={opt.index}>
                      {opt.value}
                    </option>
                  ))}
                </select>
                <BiChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  size={20}
                  color="#5F372F"
                />
              </div>
            </div>

            {/* 교수 */}
            <div className="flex flex-col gap-[8px]">
              <label className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">교수님</label>
              <input
                type="text"
                value={selectprofessor}
                onChange={(e) => setProfessor(e.target.value)}
                placeholder="교수님 성함을 입력하세요"
                className="
                  w-full h-[40px] rounded-[12px] border-2 bg-white px-[12px]
                  font-[Pretendard] text-[14px] font-semibold
                  focus:outline-none
                  border-primary-600 text-gray-700 placeholder-gray-400
                "
              />
            </div>

            {/* 구분 */}
            <div className="flex flex-col gap-[10px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">구분</div>
              <div className="flex gap-[10px]">
                {["전공", "교양", "기초"].map((v) => {
                  const active = selectedCategory === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setSelectedCategory(v)}
                      className={`
                        h-[28px] px-[12px] rounded-[14px] border-2 text-[14px] font-[Pretendard]
                        ${active ? "bg-primary-600 text-white" : "bg-white text-primary-600"}
                        border-primary-600
                      `}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ===== /필터 팝업 ===== */}
    </section>
  );
}
