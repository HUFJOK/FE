import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getMyDownloadedMaterials,
  getMyUploadedMaterials,
} from "../../api/users";

type MeMaterialItem = {
  id: number;
  title: string;
  professorName: string;
};

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

/** 목록 카드 */
function DocRow({
  item,
  showEditAndDelete,
  onEdit,
  onDelete,
  onOpenDetail,
}: {
  item: MeMaterialItem;
  showEditAndDelete: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  return (
    <article
      onClick={() => onOpenDetail(item.id)}
      className="relative cursor-pointer w-[940px] rounded-[12px] px-[20px] py-[26px] bg-primary-100"
    >
      <div className="flex items-start pr-[20px]">
        <div className="flex-1 min-w-0">
          <h3 className="title-sm mb-[10px]">{item.title}</h3>
          <p className="body-sm text-[#5B5B5B]">
            교수명: {item.professorName || "-"}
          </p>
        </div>
      </div>

      <div className="absolute right-[20px] bottom-[20px] flex gap-[10px]">
        {showEditAndDelete ? (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(item.id);
              }}
              className="inline-flex items-center justify-center px-[10px] py-[5px] rounded-[12px] border-2 bg-primary-100 border-primary-700 text-primary-700 body-md tracking-[-0.4px]"
            >
              수정
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="inline-flex items-center justify-center px-[10px] py-[5px] rounded-[12px] border-2 bg-primary-100 border-primary-700 text-primary-700 body-md tracking-[-0.4px]"
            >
              삭제
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="inline-flex items-center justify-center px-[10px] py-[5px] rounded-[12px] border-2 bg-primary-100 border-primary-700 text-primary-700 body-md tracking-[-0.4px]"
          >
            삭제
          </button>
        )}
      </div>
    </article>
  );
}

export default function MyData(): React.JSX.Element {
  const navigate = useNavigate();

  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [items, setItems] = useState<MeMaterialItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchList() {
      try {
        setLoading(true);
        setErrorMsg(null);

        if (tab === "buy") {
          const res = await getMyDownloadedMaterials(1);
          const list = Array.isArray(res?.materials) ? res.materials : [];
          if (mounted) {
            setItems(
              list.map((m) => ({
                id: m.id,
                title: m.title,
                professorName: m.professorName,
              })),
            );
          }
        } else {
          const res = await getMyUploadedMaterials(1);
          const list = Array.isArray(res?.materials) ? res.materials : [];
          if (mounted) {
            setItems(
              list.map((m) => ({
                id: m.id,
                title: m.title,
                professorName: m.professorName,
              })),
            );
          }
        }
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
    setItems((prev) => prev.filter((v) => v.id !== id));

  const showEditAndDelete = useMemo(() => tab === "sell", [tab]);

  return (
    <div className="max-w-6xl py-7.5 mx-auto flex justify-center items-start gap-16.25">
      {/* 좌측 카테고리 */}
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
            {items.length > 0 ? (
              items.map((it) => (
                <DocRow
                  key={it.id}
                  item={it}
                  showEditAndDelete={showEditAndDelete}
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
