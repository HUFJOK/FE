import React, { useMemo, useState } from "react";
import { BiSearch, BiChevronDown, BiChevronUp, BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Option } from "../data/OptionData";
import { MajorOptions } from "../data/OptionData";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";

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
  price: number;
};

const sample: DocItem[] = [
  { id: 1, title: "2025-1 기계학습 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 125, reviews: 10, price: 200 },
  { id: 2, title: "2025-1 알고리즘 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 122, reviews: 15, price: 300 },
  { id: 3, title: "2025-1 알고리즘 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 127, reviews: 20, price: 250 },
  { id: 4, title: "2025-1 기계학습 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 126, reviews: 25, price: 180 },
];

const SEMESTER_OPTIONS = ["25-2", "25-1", "24-2", "24-1", "23-2", "23-1", "22-2", "22-1", "21-2", "21-1", "20-2", "20-1"];
const GRADE_OPTIONS = ["1학년", "2학년", "3학년", "4학년"];

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

/** 카드 */
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

        {/* 우측 정보 */}
        <div className="ml-[16px] shrink-0 text-right font-[Pretendard] text-[14px] font-semibold text-[#5B5B5B]">
          <div>다운로드 {item.downloads}회</div>
          <div>리뷰 {item.reviews}개</div>
          <div className="text-primary-600 mt-[2px]">{item.price}P</div>
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
  const [sortLabel, setSortLabel] = useState<"추천순" | "다운로드순" | "최신순">("추천순");

  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Option | null>(null);
  const [selectProfessor, setProfessor] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredSorted = useMemo(() => {
    let arr = !q.trim()
      ? [...sample]
      : sample.filter((s) => s.title.includes(q.trim()));

    switch (sortLabel) {
      case "추천순":
        arr.sort((a, b) => b.reviews - a.reviews || b.downloads - a.downloads);
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
        <Button
          text="올리기"
          font="body-lg"
          color={600}
          onClick={() => navigate("../data/upload")}
        />
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
        <div 
          className="[&_input]:bg-gray-100 [&_input]:border-none
        [&_input]:outline-none">
          <Input
            id="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어를 입력해 주세요."
            font="body-md"
          />
        </div>
          <BiSearch size={23} color="#5F372F" className="ml-[12px] shrink-0" />
        </div>
      </div>

      {/* 필터 + 칩 */}
      <div className="flex items-center justify-center gap-[10px] mb-[24px]">
        <div
          className="
            w-[77px] h-[36px] rounded-[20px]
            flex items-center justify-center
            [&>div]:w-full [&>div]:h-full [&>div]:rounded-[20px]
            [&>div]:flex [&>div]:items-center [&>div]:justify-center
          "
        >
          <Button text="필터링" font="body-sm" color={500} onClick={() => setFilterOpen(true)} isFull/>
        </div>
        <Chip>{selectedSemester ?? "학기"}</Chip>
        <Chip>{selectedGrade ?? "학년"}</Chip>
        <Chip>{selectedMajor?.value ?? "전공"}</Chip>
        <Chip>{selectProfessor || "교수"}</Chip>
        <Chip>{selectedCategory ?? "구분"}</Chip>
      </div>

      {/* 정렬 */}
      <div className="flex items-center justify-between mb-[18px]">
        <div className="relative">
          <Button
            text={`${sortLabel} ${sortOpen ? "▲" : "▼"}`}
            font="body-sm"
            color={600}
            isOutline
            onClick={() => setSortOpen((s) => !s)}
          />
          {sortOpen && (
            <div className="absolute z-10 mt-2 w-[120px] rounded-[10px] border-2 bg-white shadow-sm overflow-hidden border-primary-600">
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

      {/* 문서 리스트 */}
      <div className="flex flex-col gap-[16px]">
        {filteredSorted.map((item) => (
          <DocCard key={item.id} item={item} onClick={() => navigate("/data/detail")} />
        ))}
      </div>

      {/* ===== 필터 팝업 ===== */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
          <button className="absolute inset-0 bg-black/30" onClick={() => setFilterOpen(false)} aria-label="닫기 배경" />
          <div
            className="
              relative w-[400px] h-[500px]
              rounded-[12px] bg-[#F6F1ED] border-primary-600
              p-[25px] shadow-md flex flex-col gap-[15px]
            "
          >
            <button type="button" className="absolute right-[16px] top-[12px] p-1" onClick={() => setFilterOpen(false)} aria-label="닫기">
              <BiX size={24} color="#5F372F" />
            </button>

            {/* 학기 */}
            <div className="flex flex-col gap-[3px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">학기</div>
              <div className="flex flex-wrap gap-[10px]">
                {SEMESTER_OPTIONS.map((v) => {
                  const active = selectedSemester === v;
                  return (
                    <div
                      key={v}
                      className={`
                        h-[28px]
                        [&>div]:h-full [&>div]:px-[12px] [&>div]:rounded-[14px]
                        [&>div]:flex [&>div]:items-center [&>div]:justify-center
                        [&>div]:border [&>div]:border-primary-600
                        ${!active ? "[&>div]:!bg-transparent [&>div:hover]:!bg-transparent" : ""}
                      `}
                    >
                      <Button
                        text={v}
                        font="body-sm"
                        color={600}
                        isOutline={!active}
                        onClick={() => setSelectedSemester(v)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 학년 */}
            <div className="flex flex-col gap-[3px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">학년</div>
              <div className="flex flex-wrap gap-[10px]">
                {GRADE_OPTIONS.map((v) => {
                  const active = selectedGrade === v;
                  return (
                    <div
                      key={v}
                      className={`
                        h-[28px]
                        [&>div]:h-full [&>div]:px-[12px] [&>div]:rounded-[14px]
                        [&>div]:flex [&>div]:items-center [&>div]:justify-center
                        [&>div]:border [&>div]:border-primary-600
                        ${!active ? "[&>div]:!bg-transparent [&>div:hover]:!bg-transparent" : ""}
                      `}
                    >
                      <Button
                        text={v}
                        font="body-sm"
                        color={600}
                        isOutline={!active}
                        onClick={() => setSelectedGrade(v)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 전공 */}
            <div className="flex flex-col gap-[3px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">전공</div>
              <div
                className="
                  [&_select]:!bg-[#F6F1ED] [&_select]:border [&_select]:border-primary-600
                  [&_select]:!outline-none [&_select]:!ring-0
                "
              >
                <Dropdown
                  options={MajorOptions}
                  value={selectedMajor}
                  onChange={(v) => setSelectedMajor(v)}
                  placeholder="전공"
                  font="body-sm"
                />
              </div>
            </div>

            {/* 교수님 */}
            <div className="flex flex-col gap-[3px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">교수님</div>
              <div
                className="
                  [&>input]:!bg-transparent [&>input]:border [&>input]:border-primary-600
                  [&>input]:!outline-none [&>input]:!ring-0
                "
              >
                <Input
                  id="professor"
                  value={selectProfessor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="교수님 성함을 입력하세요"
                  font="body-sm"
                />
              </div>
            </div>

            {/* 구분 */}
            <div className="flex flex-col gap-[3px]">
              <div className="font-[Pretendard] text-[16px] font-semibold text-[#3b3b3b]">구분</div>
              <div className="flex flex-wrap gap-[10px]">
                {["전공", "교양", "기초"].map((v) => {
                  const active = selectedCategory === v;
                  return (
                    <div
                      key={v}
                      className={`
                        h-[28px]
                        [&>div]:h-full [&>div]:px-[12px] [&>div]:rounded-[14px]
                        [&>div]:flex [&>div]:items-center [&>div]:justify-center
                        [&>div]:border [&>div]:border-primary-600
                        ${!active ? "[&>div]:!bg-transparent [&>div:hover]:!bg-transparent" : ""}
                      `}
                    >
                      <Button
                        text={v}
                        font="body-sm"
                        color={600}
                        isOutline={!active}
                        onClick={() => setSelectedCategory(v)}
                      />
                    </div>
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
