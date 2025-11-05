import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type Item = {
  id: number;
  title: string;
  semester: string;
  grade: string;
  major: string;
  professor: string;
  type: string;
};

const purchasedSeed: Item[] = [
  { id: 1, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공" },
  { id: 2, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공" },
  { id: 3, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공" },
  { id: 4, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공" },
  { id: 5, title: "2025-1 컴퓨팅 사고 중간고사 족보", semester: "2025-2", grade: "3학년", major: "컴퓨터공학부", professor: "김외대 교수님", type: "전공" },
];

const soldSeed: Item[] = [
  { id: 101, title: "2024-2 자료구조 기말 족보", semester: "2024-2", grade: "2학년", major: "컴퓨터공학부", professor: "홍길동 교수님", type: "전공" },
  { id: 102, title: "2024-1 이산수학 중간 족보", semester: "2024-1", grade: "1학년", major: "컴퓨터공학부", professor: "아무개 교수님", type: "전공" },
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
        "transition hover:brightness-[1.03] active:translate-y-[1px]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30",
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
        "transition hover:brightness-[1.03] active:translate-y-[1px]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600/30",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function DocRow({
  item,
  showEditAndDelete,
  onDelete,
  onEdit,
  onOpenDetail,
}: {
  item: Item;
  showEditAndDelete: boolean;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  return (
    <article
      onClick={() => onOpenDetail(item.id)}
      className={[
        "relative cursor-pointer",
        "w-[937px] h-[108px] rounded-[12px] px-[20px] py-[26px]",
        "bg-[#F6F1ED] border border-primary-600/12",
        "transition hover:shadow-sm",
      ].join(" ")}
    >
      <div className="flex items-start pr-[120px]">
        <div className="flex-1 min-w-0">
          <h3 className="mb-[8px] text-[#232323] font-extrabold tracking-[-0.6px] text-[22px] font-[Pretendard]">
            {item.title}
          </h3>
          <p className="text-[#5B5B5B] font-[Pretendard] text-[14px] font-semibold tracking-[-0.2px]">
            {item.semester} &nbsp; {item.grade} &nbsp; {item.major} &nbsp; {item.professor} &nbsp; {item.type}
          </p>
        </div>
      </div>

      {/* 우측 하단 버튼 영역 */}
      <div className="absolute right-[20px] bottom-[20px] flex gap-[8px]">
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

export default function MyDataPage(): React.JSX.Element {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [purchased, setPurchased] = useState<Item[]>(purchasedSeed);
  const [sold, setSold] = useState<Item[]>(soldSeed);

  const list = useMemo(() => (tab === "buy" ? purchased : sold), [tab, purchased, sold]);

  const handleDelete = (id: number) => {
    if (tab === "buy") setPurchased((prev) => prev.filter((i) => i.id !== id));
    else setSold((prev) => prev.filter((i) => i.id !== id));
  };

  const handleEdit = (id: number) => {
    navigate("/data/upload");
  };

  const openDetail = (id: number) => {
    navigate("/data/detail");
  };

  return (
    <section className="max-w-[1120px] mx-auto px-4 pt-[24px] pb-[60px]">
      <div className="flex gap-[68px]">
        {/* 좌측 카테고리 */}
        <aside className="w-[145px] shrink-0 flex flex-col gap-[25px]">
          <CategoryButton active={tab === "buy"} onClick={() => setTab("buy")}>
            구매 족보
          </CategoryButton>
          <CategoryButton active={tab === "sell"} onClick={() => setTab("sell")}>
            판매 족보
          </CategoryButton>
        </aside>

        {/* 리스트 */}
        <div className="flex-1 flex flex-col gap-[20px]">
          {list.map((it) => (
            <DocRow
              key={it.id}
              item={it}
              showEditAndDelete={tab === "sell"}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onOpenDetail={openDetail}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
