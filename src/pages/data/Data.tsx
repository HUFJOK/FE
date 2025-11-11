import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/** 목록 아이템 타입 */
type Item = {
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

/** 샘플 데이터 */
const purchasedSeed: Item[] = [
  { id: 1, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 120, reviews: 10, price: 200 },
  { id: 2, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 120, reviews: 10, price: 300 },
  { id: 3, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 120, reviews: 10, price: 250 },
  { id: 4, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 120, reviews: 10, price: 180 },
  { id: 5, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공", downloads: 120, reviews: 10, price: 190 },
];

const soldSeed: Item[] = [
  { id: 101, title: "2024-2 자료구조 기말 족보", semester: "2024-2", grade: "2학년", major: "컴퓨터공학부", professor: "홍길동 교수님", type: "전공", downloads: 98, reviews: 5, price: 200 },
  { id: 102, title: "2024-1 이산수학 중간 족보", semester: "2024-1", grade: "1학년", major: "컴퓨터공학부", professor: "아무개 교수님", type: "전공", downloads: 76, reviews: 3, price: 200 },
];

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
        "w-[145px] h-[53px] rounded-[20px]",
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

/** 수정/삭제 버튼 */
function RowButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick(e);
      }}
      className={[
        "inline-flex items-center justify-center",
        "px-[10px] py-[5px] rounded-[12px] border-2",
        "bg-primary-100 border-primary-700 text-primary-700",
        "body-md",
        "tracking-[-0.4px]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/** 목록 카드 한 줄 */
function DocRow({
  item,
  showEditAndDelete,
  displayMode,
  onDelete,
  onEdit,
  onOpenDetail,
}: {
  item: Item;
  showEditAndDelete: boolean;
  displayMode: "buy" | "sell";
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  return (
    <article
      onClick={() => onOpenDetail(item.id)}
      className={[
        "relative cursor-pointer",
        "w-[940px] rounded-[12px] px-[20px] py-[26px]",
        "bg-primary-100",
      ].join(" ")}
    >
      <div className="flex items-start pr-[20px]">
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="title-sm mb-[10px]">
            {item.title}
          </h3>

          {/* 구매 탭 */}
          {displayMode === "buy" && (
            <p className="body-sm">
              {item.semester} &nbsp; {item.grade} &nbsp; {item.major} &nbsp;
              {item.professor} &nbsp; {item.type}
            </p>
          )}

          {/* 판매 탭 */}
          {displayMode === "sell" && (
            <p className="body-sm">
              다운로드 {item.downloads}회 &nbsp; 리뷰 {item.reviews}개 &nbsp; 가격 {item.price}P
            </p>
          )}
        </div>
      </div>

      {/* 우측 하단 버튼 영역 */}
      <div className="absolute right-[20px] bottom-[20px] flex gap-[10px]">
        {showEditAndDelete ? (
          <>
            <RowButton onClick={() => onEdit(item.id)}>수정</RowButton>
            <RowButton onClick={() => onDelete(item.id)}>삭제</RowButton>
          </>
        ) : (
          <RowButton onClick={() => onDelete(item.id)}>삭제</RowButton>
        )}
      </div>
    </article>
  );
}

/** 전체 레이아웃 */
export default function MyDataFixedLayout(): React.JSX.Element {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [purchased, setPurchased] = useState<Item[]>(purchasedSeed);
  const [sold, setSold] = useState<Item[]>(soldSeed);

  const list = useMemo(
    () => (tab === "buy" ? purchased : sold),
    [tab, purchased, sold]
  );

  const openDetail = (id: number) => navigate("/data/detail");
  const handleEdit = (id: number) => navigate("/data/upload");
  const handleDelete = (id: number) => {
    if (tab === "buy")
      setPurchased((prev) => prev.filter((v) => v.id !== id));
    else setSold((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="max-w-6xl py-7.5 mx-auto flex justify-center items-start gap-16.25">
      {/* 좌측 카테고리 버튼 영역 */}
      <div className="flex flex-col gap-6.25">
        <CategoryButton active={tab === "buy"} onClick={() => setTab("buy")}>
          구매 족보
        </CategoryButton>
        <CategoryButton active={tab === "sell"} onClick={() => setTab("sell")}>
          판매 족보
        </CategoryButton>
      </div>

      {/* 가운데 콘텐츠 영역 */}
      <div className="w-235 bg-transparent rounded-xl flex flex-col justify-start items-center gap-7.5">
        <div className="w-full flex flex-col gap-5">
          {list.map((it) => (
            <DocRow
              key={it.id}
              item={it}
              showEditAndDelete={tab === "sell"}
              displayMode={tab}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onOpenDetail={openDetail}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
