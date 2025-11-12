import React, { useEffect, useMemo, useState } from "react";
import { BiSearch, BiX } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import type { Option } from "../data/OptionData";
import { MajorOptions } from "../data/OptionData";
import Input from "../components/Input";
import Dropdown from "../components/Dropdown";
import Button from "../components/Button";
import { getMaterials } from "../api/materials";

/** 년도학기표기 변환  */
function parseYearSemester(label: string | null) {
  if (!label) return { year: undefined, semester: undefined };
  const [yy, sem] = label.split("-");
  const year = Number.isFinite(Number(yy)) ? 2000 + Number(yy) : undefined;
  const semester = Number.isFinite(Number(sem)) ? Number(sem) : undefined;
  return { year, semester };
}

/** 서버 응답 */
type MaterialVM = {
  id: number;
  title: string;
  professorName: string;
  // 서버가 아직 제공하지 않는 필드는 표시용 기본값
  downloads?: number;
  reviews?: number;
  price?: number;
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

/** 칩 */
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      className="
        inline-flex items-center justify-center
        h-[36px] px-[18px] rounded-[18px] border-1
        body-md
        bg-white text-primary-600 border-primary-600
      "
    >
      {children}
    </button>
  );
}

/** 카드 */
function DocCard({ item, onClick }: { item: MaterialVM; onClick: () => void }) {
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
          <p className="body-sm text-[#5B5B5B]">
            교수: {item.professorName ?? "-"}
          </p>
        </div>

        {/* 우측 */}
        <div className="ml-[16px] shrink-0 text-right body-sm text-[#5B5B5B]">
          <div>다운로드 {item.downloads ?? 0}회</div>
          <div>리뷰 {item.reviews ?? 0}개</div>
          <div className="text-primary-600 mt-[2px]">{item.price ?? 0}P</div>
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

  // 서버 sortBy 매핑 (Swagger에 최신순만 존재)
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

        const next: MaterialVM[] = data.materials.map((m) => ({
          id: m.id,
          title: m.title,
          professorName: m.professorName,
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

  // 서버는 최신순만 지원
  const viewList = useMemo(() => {
    const arr = [...items];
    switch (sortLabel) {
      case "추천순":
        arr.sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0));
        break;
      case "다운로드순":
        arr.sort((a, b) => (b.downloads ?? 0) - (a.downloads ?? 0));
        break;
      case "최신순":
      default:
        // 서버 latest 사용
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
      <div className="flex justify-center mt-[60px] mb-[16px]">
        <div className="flex justify-between items-center shrink-0 w-[770px] h-[63px] p-[20px] rounded-[8px] border-2 bg-gray-100 border-primary-600">
          <div className="[&_input]:bg-gray-100 [&_input]:border-none [&_input]:outline-none">
            <Input
              type="text"
              id="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="검색어를 입력해 주세요."
              font="body-md"
            />
          </div>
        </div>
      </div>

      {/* 필터 + 칩 */}
      <div className="flex items-center justify-center gap-[10px] mb-[24px]">
        <div className="w-[77px] h-[36px] rounded-[20px] flex items-center justify-center [&>div]:w-full [&>div]:h-full [&>div]:rounded-[20px] [&>div]:flex [&>div]:items-center [&>div]:justify-center">
          <Button
            text="필터링"
            font="body-sm"
            color={500}
            onClick={() => setFilterOpen(true)}
            isFull
          />
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
            key={item.id}
            item={item}
            onClick={() => navigate(`/data/detail?id=${item.id}`)}
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
          <button
            className="absolute inset-0 bg-black/30"
            onClick={() => setFilterOpen(false)}
            aria-label="닫기 배경"
          />
          <div className="relative w-[400px] h-[500px] rounded-[12px] bg-[#F6F1ED] border-primary-600 p-[25px] shadow-md flex flex-col gap-[15px]">
            <button
              type="button"
              className="absolute right-[16px] top-[12px] p-1"
              onClick={() => setFilterOpen(false)}
              aria-label="닫기"
            >
              <BiX size={24} color="#5F372F" />
            </button>

            {/* 학기 필터 */}
            <div className="flex flex-col gap-[3px]">
              <div className="body-sm text-[#3b3b3b]">학기</div>
              <div className="flex flex-wrap gap-[10px]">
                {SEMESTER_OPTIONS.map((v) => {
                  const active = selectedSemester === v;
                  return (
                    <div
                      key={v}
                      className={`h-[28px] [&>div]:h-full [&>div]:px-[12px] [&>div]:rounded-[14px] [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:border [&>div]:border-primary-600 ${!active ? "[&>div]:!bg-transparent [&>div:hover]:!bg-transparent" : ""}`}
                    >
                      <Button
                        text={v}
                        font="body-caption"
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
              <div className="body-sm text-[#3b3b3b]">학년</div>
              <div className="flex flex-wrap gap-[10px]">
                {GRADE_OPTIONS.map((v) => {
                  const active = selectedGrade === v;
                  return (
                    <div
                      key={v}
                      className={`h-[28px] [&>div]:h-full [&>div]:px-[12px] [&>div]:rounded-[14px] [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:border [&>div]:border-primary-600 ${!active ? "[&>div]:!bg-transparent [&>div:hover]:!bg-transparent" : ""}`}
                    >
                      <Button
                        text={v}
                        font="body-caption"
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
              <div className="body-sm text-[#3b3b3b]">전공</div>
              <div className="[&_select]:!bg-[#F6F1ED] [&_select]:border [&_select]:border-primary-600 [&_select]:!outline-none [&_select]:!ring-0">
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
            <div className="flex flex-col gap-[3px]">
              <div className="body-sm text-[#3b3b3b]">교수님</div>
              <div className="[&>input]:!bg-transparent [&>input]:border [&>input]:border-primary-600 [&>input]:!outline-none [&>input]:!ring-0">
                <Input
                  type="text"
                  id="professor"
                  value={selectProfessor}
                  onChange={(e) => setProfessor(e.target.value)}
                  placeholder="교수님 성함을 입력하세요"
                  font="body-caption"
                />
              </div>
            </div>

            {/* 구분 */}
            <div className="flex flex-col gap-[3px]">
              <div className="body-sm text-[#3b3b3b]">구분</div>
              <div className="flex flex-wrap gap-[10px]">
                {["전공", "교양", "기초"].map((v) => {
                  const active = selectedCategory === v;
                  return (
                    <div
                      key={v}
                      className={`h-[28px] [&>div]:h-full [&>div]:px-[12px] [&>div]:rounded-[14px] [&>div]:flex [&>div]:items-center [&>div]:justify-center [&>div]:border [&>div]:border-primary-600 ${!active ? "[&>div]:!bg-transparent [&>div:hover]:!bg-transparent" : ""}`}
                    >
                      <Button
                        text={v}
                        font="body-caption"
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
