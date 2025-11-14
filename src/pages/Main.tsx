import React, { useEffect, useMemo, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Option } from "../data/OptionData";
import { GradeOptions, MajorOptions } from "../data/OptionData";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { getMaterials } from "../api/materials";
import type { MaterialListResponse, MaterialSummary } from "../api/types";

/** 학기 표시 방식 */
function parseYearSemester(
  label: string | null,
): { year?: number; semester?: number } {
  if (!label) return {};
  const [yy, sem] = label.split("-");
  const yyNum = Number(yy);
  const semNum = Number(sem);
  const year = Number.isFinite(yyNum) ? 2000 + yyNum : undefined;
  const semester = Number.isFinite(semNum) ? semNum : undefined;
  return { year, semester };
}

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

/** 상단 칩 */
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

/** 목록 카드 */
function DocCard({
  item,
  onClick,
}: {
  item: MaterialSummary;
  onClick: () => void;
}) {
  const yearSemesterText = `${item.year}-${item.semester}`;

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
          <h3 className="title-sm text-[#232323] mb-[8px]">{item.title}</h3>

          <p className="body-sm text-[#5B5B5B] flex flex-wrap gap-x-[12px] gap-y-[2px]">
            <span>{yearSemesterText}</span>
            <span>{item.grade}</span>
            <span>{item.major}</span>
            <span>{item.professorName} 교수님</span>
            <span>{item.courseDivision}</span>
          </p>
        </div>

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

  // 검색 / 정렬 / 필터 상태
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

  // 데이터 / 페이지네이션 상태
  const [items, setItems] = useState<MaterialSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 필터 초기화
  const resetFilters = () => {
    setSelectedSemester(null);
    setSelectedGrade(null);
    setSelectedMajor(null);
    setProfessor("");
    setSelectedCategory(null);
    setCurrentPage(1);
  };

  // 검색어 디바운스
  const [qDebounced, setQDebounced] = useState(q);
  useEffect(() => {
    const t = setTimeout(() => setQDebounced(q.trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // 최신순 정렬
  const sortBy = useMemo(
    () => (sortLabel === "최신순" ? "latest" : undefined),
    [sortLabel],
  );

  // 목록 조회
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
          page: currentPage,
        });

        const list = data as MaterialListResponse;
        setItems(Array.isArray(list.materials) ? list.materials : []);
        setTotalPages(list.pageInfo?.totalPages ?? 1);
      } catch (e) {
        console.error("자료 목록 조회 실패:", e);
        setErrorMsg("목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
        setItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [qDebounced, selectedSemester, sortBy, currentPage]);

  // 필터  정렬
  const viewList = useMemo(() => {
    const base = Array.isArray(items) ? items : [];

    const filtered = base.filter((it) => {
      if (selectedGrade && it.grade !== selectedGrade) return false;
      if (selectedMajor && it.major !== selectedMajor.value) return false;
      if (
        selectProfessor &&
        !it.professorName?.includes(selectProfessor.trim())
      )
        return false;
      if (selectedCategory && it.courseDivision !== selectedCategory)
        return false;
      return true;
    });

    const arr = [...filtered];
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
  }, [
    items,
    sortLabel,
    selectedGrade,
    selectedMajor,
    selectProfessor,
    selectedCategory,
  ]);

  // 페이지 버튼
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    setCurrentPage(page);
  };

  // 페이지 번호
  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let p = start; p <= end; p += 1) pages.push(p);
    return pages;
  }, [currentPage, totalPages]);

  return (
    <section className="relative max-w-[1120px] mx-auto px-4 pt-[28px] pb-[60px]">
      {/* 올리기 버튼 */}
      <div className="absolute right-0 top-[20px]">
        <Button
          text="올리기"
          font="body-lg"
          color={600}
          onClick={() => navigate("/data/upload")}
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
              onChange={(e) => {
                setQ(e.target.value);
                setCurrentPage(1); // 검색어 변경 시 1페이지로
              }}
              placeholder="검색어를 입력해 주세요."
              font="body-md"
            />
          </div>
          <BiSearch size={24} className="ml-[12px] text-primary-600" />
        </div>
      </div>

      {/* 필터링 버튼 칩 */}
      <div className="flex items-center justify-center gap-[12px] mb-[24px]">
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
                  className="w-full text-left px-3 py-2 hover:bg-primary-100 body-sm font-semibold text-primary-600"
                  onClick={() => {
                    setSortLabel(it);
                    setSortOpen(false);
                    setCurrentPage(1);
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

      {/* 리스트 */}
      <div className="flex flex-col gap-[16px]">
        {viewList.map((item) => (
          <DocCard
            key={item.id}
            item={item}
            onClick={() => navigate(`/data/${item.id}`)}
          />
        ))}
        {!loading && !errorMsg && viewList.length === 0 && (
          <div className="text-center text-[#5B5B5B] body-md">
            검색 조건에 맞는 자료가 없습니다.
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white border border-gray-300 px-4 py-2 shadow-sm">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!canPrev}
            className={`
              px-3 py-1 rounded-full text-sm
              ${canPrev ? "text-primary-600 hover:bg-primary-50" : "text-gray-300 cursor-not-allowed"}
            `}
          >
            이전
          </button>

          {pageNumbers.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => handlePageChange(p)}
              className={`
                w-8 h-8 rounded-full text-sm flex items-center justify-center
                ${
                  p === currentPage
                    ? "bg-primary-600 text-white"
                    : "bg-transparent text-primary-600 hover:bg-primary-50"
                }
              `}
            >
              {p}
            </button>
          ))}

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!canNext}
            className={`
              px-3 py-1 rounded-full text-sm
              ${canNext ? "text-primary-600 hover:bg-primary-50" : "text-gray-300 cursor-not-allowed"}
            `}
          >
            다음
          </button>
        </div>
      </div>

      {/* ===== 필터 팝업 ===== */}
      {filterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          {/* 배경 */}
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setFilterOpen(false)}
            aria-label="닫기 배경"
          />

          {/* 팝업 박스 */}
          <div
            className="
              relative
              w-[343px] h-[570px]
              rounded-[20px] border-2 border-primary-600 bg-[#F6F1ED]
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
                      onClick={() => {
                        setSelectedSemester(v);
                        setCurrentPage(1);
                      }}
                      className={`
                        w-[46px] h-[27px] rounded-[20px]
                        border-2 border-primary-600
                        caption
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
                {GradeOptions.map((v) => {
                  const active = selectedGrade === v.value;
                  return (
                    <button
                      key={v.value}
                      type="button"
                      onClick={() => {
                        setSelectedGrade(v.value);
                        setCurrentPage(1);
                      }}
                      className={`
                        w-[55px] h-[27px] rounded-[20px]
                        border-2 border-primary-600
                        caption
                        flex items-center justify-center
                        ${
                          active
                            ? "bg-primary-600 text-gray-100"
                            : "bg-gray-100 text-primary-600"
                        }
                      `}
                    >
                      {v.value}
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
                  mt-[3px] h-[46px]
                  [&_select]:h-full [&_select]:w-full
                  [&_select]:px-[18px] [&_select]:rounded-[27px]
                  [&_select]:bg-primary-100
                  [&_select]:border-2 [&_select]:border-primary-600
                  [&_select]:outline-none [&_select]:ring-0
                  [&_select]:caption
                "
              >
                <Dropdown
                  options={MajorOptions}
                  value={selectedMajor}
                  onChange={(v) => {
                    setSelectedMajor(v);
                    setCurrentPage(1);
                  }}
                  placeholder="전공"
                  font="caption"
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
                  professor-input-wrapper
                "
              >
                <input
                  type="text"
                  id="professor"
                  value={selectProfessor}
                  onChange={(e) => {
                    setProfessor(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="교수명 입력"
                  className="
                    w-full
                    bg-transparent
                    ml-5
                    border-none
                    outline-none
                    shadow-none
                    font-[Pretendard]
                    text-[14px]
                    text-primary-700
                    placeholder:text-gray-400
                  "
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
                      onClick={() => {
                        setSelectedCategory(v);
                        setCurrentPage(1);
                      }}
                      className={`
                        w-[55px] h-[27px] rounded-[20px]
                        border-2 border-primary-600
                        caption
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

            {/* 필터 초기화 */}
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={resetFilters}
                className="caption text-primary-600 underline"
              >
                필터 초기화
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ===== /필터 팝업 ===== */}
    </section>
  );
}
