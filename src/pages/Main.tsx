import React, { useEffect, useMemo, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Option } from "../data/OptionData";
import { MajorOptions } from "../data/OptionData";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { getMaterials } from "../api/materials";
import type { MaterialGetResponse } from "../api/types";

/** 년도학기표기 변환  */
function parseYearSemester(label: string | null) {
  if (!label) return { year: undefined, semester: undefined };
  const [yy, sem] = label.split("-");
  const year = Number.isFinite(Number(yy)) ? 2000 + Number(yy) : undefined;
  const semester = Number.isFinite(Number(sem)) ? Number(sem) : undefined;
  return { year, semester };
}

/** 카드 정보 리스트 */
type MaterialVM = {
  materialId: number;
  title: string;
  year: number;
  semester: number;
  grade: string;
  courseDivision: string;
  courseName: string;
  professorName: string;
  reviewCount: number;
  downloadCount: number;
};

const SEMESTER_OPTIONS = [
  "25-2",
  "25-1",
  "24-2",
  "24-1",
  "23-2",
  "23-1",
  "22-2",
  "22-1",
  "21-2",
  "21-1",
  "20-2",
  "20-1",
];

const GRADE_OPTIONS = ["1학년", "2학년", "3학년", "4학년"];

/** 칩 (필터 바에 쓰는 학기/학년/전공/교수/구분) */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="
        inline-flex items-center justify-center
        w-[77px] h-[36px] rounded-[20px]
        body-md
        bg-gray-100 text-primary-600 border border-primary-600
      "
    >
      {children}
    </button>
  );
}

/** 카드 */
function DocCard({ item, onClick }: { item: MaterialVM; onClick: () => void }) {
  const yearSemesterText = `${item.year}-${item.semester}`;
  const gradeText = item.grade ? `${item.grade}학년` : "";
  const majorOrCourseText = item.courseName;

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
          {/* 제목 */}
          <h3 className="title-sm text-[#232323] mb-[8px]">{item.title}</h3>

          {/* 하단 정보 */}
          <p className="body-sm text-[#5B5B5B] flex flex-wrap gap-x-[12px] gap-y-[2px]">
            <span>{yearSemesterText}</span>
            <span>{gradeText}</span>
            <span>{majorOrCourseText}</span>
            <span>{item.professorName} 교수님</span>
            <span>{item.courseDivision}</span>
          </p>
        </div>

        {/* 우측: 다운로드 / 리뷰 / 가격 */}
        <div className="ml-[16px] shrink-0 text-right body-sm text-[#5B5B5B]">
          <div>다운로드 {item.downloadCount ?? 0}회</div>
          <div>리뷰 {item.reviewCount ?? 0}개</div>
          <div className="text-primary-600 mt-[2px]">200P</div>
        </div>
      </div>
    </article>
  );
}

export default function MainContent(): React.JSX.Element {
  const navigate = useNavigate();

  // 검색/정렬/필터 상태
  const [q, setQ] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState<
    "추천순" | "다운로드순" | "최신순"
  >("최신순");

  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Option | null>(null);
  const [selectProfessor, setProfessor] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 데이터 상태
  const [items, setItems] = useState<MaterialVM[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 검색어 디바운스
  const [qDebounced, setQDebounced] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // 서버 sortBy 매핑
  const sortBy = useMemo(
    () => (sortLabel === "최신순" ? "latest" : undefined),
    [sortLabel],
  );

  // 목록 호출
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const { year, semester } = parseYearSemester(selectedSemester);

        const data = await getMaterials({
          keyword: qDebounced || undefined,
          year,
          semester,
          sortBy: sortBy as "latest" | undefined,
          page: 1,
        });

        const list = data as MaterialGetResponse[];

        const next: MaterialVM[] = list.map((m) => ({
          materialId: m.materialId,
          title: m.title,
          year: m.year,
          semester: m.semester,
          grade: m.grade,
          courseDivision: m.courseDivision,
          courseName: m.courseName,
          professorName: m.professorName,
          reviewCount: m.reviewCount,
          downloadCount: m.downloadCount,
        }));

        setItems(next);
      } catch (e) {
        console.error("자료 목록 조회 실패:", e);
        setErrorMsg("목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [qDebounced, selectedSemester, sortBy]);

  // 클라이언트 정렬
  const viewList = useMemo(() => {
    const arr = [...items];
    switch (sortLabel) {
      case "추천순":
        arr.sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0));
        break;
      case "다운로드순":
        arr.sort((a, b) => (b.downloadCount ?? 0) - (a.downloadCount ?? 0));
        break;
      case "최신순":
      default:
        break;
    }
    return arr;
  }, [items, sortLabel]);

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
      <div className="flex justify-center mt-[50px] mb-[20px]">
        <div
          className="
            flex items-center
            w-full max-w-[770px] h-[63px]
            px-[24px]
            rounded-[20px] border-2 border-primary-600
            bg-[#F4F4F4]
          "
        >
          <div className="flex-1 [&_input]:bg-transparent [&_input]:border-none [&_input]:outline-none [&_input]:shadow-none">
            <Input
              type="text"
              id="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어를 입력해 주세요."
              font="body-md"
            />
          </div>
          <BiSearch size={24} className="ml-[12px] text-primary-600" />
        </div>
      </div>

      {/* 필터링 + 칩 (상단 바) */}
      <div className="flex items-center justify-center gap-[12px] mb-[24px]">
        {/* 필터링 버튼 */}
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="
            inline-flex items-center justify-center
            w-[77px] h-[36px] rounded-[20px]
            body-md
            bg-primary-500 text-gray-100
          "
        >
          필터링
        </button>

        {/* 칩 버튼 */}
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

      {/* 상태 표시 */}
      {loading && (
        <div className="text-center text-primary-600 mb-3">불러오는 중…</div>
      )}
      {errorMsg && (
        <div className="text-center text-red-600 mb-3">{errorMsg}</div>
      )}

      {/* 문서 리스트 */}
      <div className="flex flex-col gap-[16px]">
        {viewList.map((item) => (
          <DocCard
            key={item.materialId}
            item={item}
            onClick={() => navigate(`/data/${item.materialId}`)}
          />
        ))}
      </div>

                {/* ===== 필터 팝업 ===== */}
                  {filterOpen && (
                    <div
                      className="fixed inset-0 z-50 flex items-center justify-center"
                      role="dialog"
                      aria-modal="true"
                    >
                      {/* 반투명 배경 */}
                      <button
                        className="absolute inset-0 bg-black/30"
                        onClick={() => setFilterOpen(false)}
                        aria-label="닫기 배경"
                      />

                      {/* 팝업 박스 */}
                      <div
                        className="
                          relative
                          w-[343px] h-[530px]
                          rounded-[20px] border-2 border-primary-600
                          bg-[#F6F1ED]
                          px-[24px] pt-[45px] pb-[15px]
                          shadow-md
                          flex flex-col gap-[24px]
                        "
                      >
                        {/* X 버튼 */}
                        <button
                          type="button"
                          className="absolute right-[24px] top-[24px] p-1"
                          onClick={() => setFilterOpen(false)}
                          aria-label="닫기"
                        >
                          <BiX size={24} color="#5F372F" />
                        </button>

                        {/* 학기 */}
                        <div className="flex flex-col gap-[8px] mt-[4px]">
                          <div className="body-sm text-[#3b3b3b]">학기</div>
                          <div className="grid grid-cols-6 gap-[5px]">
                            {SEMESTER_OPTIONS.map((v) => {
                              const active = selectedSemester === v;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setSelectedSemester(v)}
                                  className={`
                                    w-[46px] h-[27px] rounded-[20px]
                                    border-2 border-primary-600
                                    body-caption
                                    flex items-center justify-center
                                    ${
                                      active
                                        ? "bg-primary-600 text-gray-100"
                                        : "bg-gray-100 text-primary-600"
                                    }
                                  `}
                                >
                                  {v}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 학년 */}
                        <div className="flex flex-col gap-[8px]">
                          <div className="body-sm text-[#3b3b3b]">학년</div>
                          <div className="grid grid-cols-4">
                            {GRADE_OPTIONS.map((v) => {
                              const active = selectedGrade === v;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setSelectedGrade(v)}
                                  className={`
                                    w-[55px] h-[27px] rounded-[20px]
                                    border-2 border-primary-600
                                    body-caption
                                    flex items-center justify-center
                                    ${
                                      active
                                        ? "bg-primary-600 text-gray-100"
                                        : "bg-gray-100 text-primary-600"
                                    }
                                  `}
                                >
                                  {v}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 전공 */}
                        <div className="flex flex-col gap-[8px]">
                          <div className="body-sm text-[#3b3b3b]">전공</div>
                          <div
                            className="
                              mt-[3px]
                              h-[46px]
                              [&_select]:h-full
                              [&_select]:w-full
                              [&_select]:px-[18px]
                              [&_select]:rounded-[27px]
                              [&_select]:bg-primary-100 [&_select]:bg-primary-100
                              [&_select]:border-2 [&_select]:border-primary-600
                              [&_select]:outline-none [&_select]:ring-0
                              [&_select]:body-caption
                            "
                          >
                            <Dropdown
                              options={MajorOptions}
                              value={selectedMajor}
                              onChange={(v) => setSelectedMajor(v)}
                              placeholder="전공"
                              font="body-caption"
                            />
                          </div>
                        </div>

                        {/* 교수님 */}
                        <div className="flex flex-col gap-[8px]">
                          <div className="body-sm text-[#3b3b3b]">교수님</div>
                          <div
                            className="
                              mt-[3px]
                              h-[46px] flex items-center
                              rounded-[20px]
                              bg-primary-100
                              border-2 border-primary-600
                            "
                          >
                            <Input
                              type="text"
                              id="professor"
                              value={selectProfessor}
                              onChange={(e) => setProfessor(e.target.value)}
                              font="body-caption"
                            />
                          </div>
                        </div>

                        {/* 구분 */}
                        <div className="flex flex-col gap-[8px] mb-[4px]">
                          <div className="body-sm text-[#3b3b3b]">구분</div>
                          <div className="flex flex-wrap gap-[10px]">
                            {["전공", "교양", "기초"].map((v) => {
                              const active = selectedCategory === v;
                              return (
                                <button
                                  key={v}
                                  type="button"
                                  onClick={() => setSelectedCategory(v)}
                                  className={`
                                    w-[55px] h-[27px] rounded-[20px]
                                    border-2 border-primary-600
                                    body-caption
                                    flex items-center justify-center
                                    ${
                                      active
                                        ? "bg-primary-600 text-gray-100"
                                        : "bg-gray-100 text-primary-600"
                                    }
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
