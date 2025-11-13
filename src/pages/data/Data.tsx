import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  getMyDownloadedMaterials,
  getMyUploadedMaterials,
} from "../../api/users";
import { getMaterial } from "../../api/materials";
import type { MaterialGetResponse } from "../../api/types";

// 학기 표기 형식 
const formatSemester = (n?: number) =>
  typeof n === "number" ? `${n}학기` : "-";

/** 좌측 카테고리 버튼 */
function CategoryButton({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center",
        "w-[145px] h-[53px] rounded-[12px]",
        "title-sm",
        active
          ? "bg-primary-600 text-white"
          : "bg-white text-primary-600 border-2 border-primary-600",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/** 우측 하단 버튼*/
function RowButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center justify-center px-[10px] py-[5px] rounded-[12px] border-2 bg-primary-100 border-primary-700 text-primary-700 body-md tracking-[-0.4px]"
    >
      {children}
    </button>
  );
}

/** 카드*/
function DocRow({
  item,
  tab,
  onEdit,
  onDelete,
  onOpenDetail,
}: {
  item: MaterialGetResponse;
  tab: "buy" | "sell";
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  const yearText = typeof item.year === "number" ? `${item.year}년` : "-";
  const semesterText = formatSemester(item.semester);

  return (
    <article
      onClick={() => onOpenDetail(item.materialId)}
      className="relative cursor-pointer w-[940px] rounded-[12px] px-[20px] py-[26px] bg-primary-100"
    >
      <div className="flex items-start pr-[20px]">
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="title-sm mb-[10px]">{item.title}</h3>

          {/* 구매 탭: 연도-학기, 학년, 전공, 교수님, 구분, 과목 */}
          {tab === "buy" && (
            <p className="body-sm text-[#5B5B5B]">
              {yearText} &nbsp; {semesterText} &nbsp;
              학년: {item.grade || "-"} &nbsp;
              {/* MaterialGetResponse 에 major 없음*/}
              전공: {"-"} &nbsp;
              구분: {item.courseDivision || "-"} &nbsp;
              교수: {item.professorName || "-"} &nbsp;
              과목: {item.courseName || "-"}
            </p>
          )}

          {/* 판매 탭: 다운로드수, 리뷰수, 가격 */}
          {tab === "sell" && (
            <p className="body-sm text-[#5B5B5B]">
              다운로드수 {item.downloadCount ?? 0}회
              &nbsp; 리뷰 {item.reviewCount ?? 0}개
              &nbsp; 가격 200P
            </p>
          )}
        </div>
      </div>

      {/* 우측 하단 버튼 */}
      <div className="absolute right-[20px] bottom-[20px] flex gap-[10px]">
        {tab === "sell" ? (
          <>
            <RowButton onClick={() => onEdit(item.materialId)}>수정</RowButton>
            <RowButton onClick={() => onDelete(item.materialId)}>삭제</RowButton>
          </>
        ) : (
          <RowButton onClick={() => onDelete(item.materialId)}>삭제</RowButton>
        )}
      </div>
    </article>
  );
}

export default function MyData(): React.JSX.Element {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [items, setItems] = useState<MaterialGetResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchList() {
      try {
        setLoading(true);
        setErrorMsg(null);

        const listRes =
          tab === "buy"
            ? await getMyDownloadedMaterials(1)
            : await getMyUploadedMaterials(1);
        const lightList = Array.isArray(listRes?.materials)
          ? listRes.materials
          : [];
        const details = await Promise.all(
          lightList.map((m) => getMaterial(m.id)),
        );

        if (mounted) setItems(details);
      } catch (e: any) {
        if (mounted) {
          setItems([]);
          setErrorMsg(e?.message || "목록을 불러오지 못했습니다.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchList();
    return () => {
      mounted = false;
    };
  }, [tab]);

  const onOpenDetail = (id: number) => navigate(`/data/${id}`);
  const onEdit = (id: number) => navigate("/data/upload", { state: { id } });
  const onDelete = (id: number) =>
    setItems((prev) => prev.filter((v) => v.materialId !== id));

  const showList = useMemo(() => items, [items]);

  return (
    <div className="max-w-6xl py-7.5 mx-auto flex justify-center items-start gap-16.25">
      <div className="flex flex-col gap-6.25">
        <CategoryButton active={tab === "buy"} onClick={() => setTab("buy")}>
          구매 족보
        </CategoryButton>
        <CategoryButton active={tab === "sell"} onClick={() => setTab("sell")}>
          판매 족보
        </CategoryButton>
      </div>

      {/* 목록 영역 */}
      <div className="w-235 bg-transparent rounded-xl flex flex-col justify-start items-center gap-7.5">
        {loading && (
          <div className="body-md text-primary-600">불러오는 중…</div>
        )}
        {errorMsg && <div className="body-md text-red-600">{errorMsg}</div>}

        {!loading && !errorMsg && (
          <div className="w-full flex flex-col gap-5">
            {showList.length > 0 ? (
              showList.map((it) => (
                <DocRow
                  key={it.materialId}
                  item={it}
                  tab={tab}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onOpenDetail={onOpenDetail}
                />
              ))
            ) : (
              <div className="body-md text-[#5B5B5B]">
                표시할 자료가 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
