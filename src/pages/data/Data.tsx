import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import {
  getMyDownloadedMaterials,
  getMyUploadedMaterials,
} from "../../api/users";
import { deleteMaterial } from "../../api/materials";
import type { MaterialSummary } from "../../api/types";

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
      className="
        inline-flex items-center justify-center
        px-[10px] py-[5px] rounded-xl border-2
        bg-primary-100 border-primary-700
        text-primary-700 body-md tracking-[-0.4px]
      "
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
  item: MaterialSummary;
  tab: "buy" | "sell";
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpenDetail: (id: number) => void;
}) {
  const professorText = item.professorName + " 교수님";

  return (
    <article
      onClick={() => onOpenDetail(item.id)}
      className="relative cursor-pointer w-[940px] rounded-xl px-[20px] py-[26px] bg-primary-100"
    >
      <div className="flex items-start pr-[20px]">
        <div className="flex-1 min-w-0">
          {/* 제목 */}
          <h3 className="title-sm mb-[10px]">{item.title}</h3>

          {/* 구매 탭: 연도-학기, 학년, 전공, 교수님, 구분 */}
          {tab === "buy" && (
            <p className="body-sm text-gray-600">
              {item.year}-{item.semester} &nbsp; {item.grade || "-"} &nbsp;
              {item.major || "-"} &nbsp; {professorText} &nbsp; {item.courseDivision || "-"}
            </p>
          )}

          {/* 판매 탭: 다운로드수, 리뷰수, 가격 */}
          {tab === "sell" && (
            <p className="body-sm text-gray-600">
              다운로드 {item.downloadCount ?? 0}회 &nbsp; 리뷰 {item.reviewCount ?? 0}개 &nbsp; 가격 200P
            </p>
          )}
        </div>
      </div>

      {/* 우측 하단 버튼 */}
      <div className="absolute right-[20px] bottom-[20px] flex gap-[10px]">
        {tab === "sell" ? (
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

export default function Data(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const [tab, setTab] = useState<"buy" | "sell">(
    location.state?.tab === "sell" ? "sell" : "buy"
  );
  const [items, setItems] = useState<MaterialSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const observer = useRef<IntersectionObserver | null>(null);

  const fetchMaterials = useCallback(
    async (page: number, currentTab: "buy" | "sell") => {
      setLoading(true);
      setErrorMsg(null);
      try {
        const apiCall =
          currentTab === "buy"
            ? getMyDownloadedMaterials
            : getMyUploadedMaterials;
        const response = await apiCall(page);

        if (response.materials) {
          setItems((prevItems) =>
            page === 1 ? response.materials : [...prevItems, ...response.materials],
          );
          setTotalPages(response.pageInfo.totalPages);
        }
      } catch (e: any) {
        setErrorMsg(e?.message || "목록을 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    setItems([]);
    setCurrentPage(1);
    setTotalPages(1);
    fetchMaterials(1, tab);
  }, [tab, fetchMaterials]);

  const onOpenDetail = (id: number) => navigate(`/data/${id}`);
  const onEdit = (id: number) => navigate(`/data/edit/${id}`);

  const onDelete = async (id: number) => {
    if (tab === "sell") {
      if (window.confirm("정말로 삭제하시겠습니까?")) {
        try {
          await deleteMaterial(id);
          setItems((prev) => prev.filter((v) => v.id !== id));
          alert("자료가 삭제되었습니다.");
        } catch (error) {
          console.error("Failed to delete material:", error);
          alert("자료 삭제에 실패했습니다.");
        }
      }
    } else {
      // 자료 구매 내역 삭제 API 추가 시 연동
      setItems((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchMaterials(nextPage, tab);
    }
  };

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && currentPage < totalPages) {
          handleLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, currentPage, totalPages, handleLoadMore],
  );

  return (
    <div className="max-w-6xl py-7.5 mx-auto flex justify-center items-start gap-16.25">
      <div className="flex flex-col gap-6.25">
        <Button
          text="구매 족보"
          font="title-sm"
          isOutline={tab !== "buy"}
          onClick={() => setTab("buy")}
        />
        <Button
          text="판매 족보"
          font="title-sm"
          isOutline={tab !== "sell"}
          onClick={() => setTab("sell")}
        />
      </div>

      {/* 목록 영역 */}
      <div className="w-235 bg-transparent rounded-xl flex flex-col justify-start items-center gap-7.5">
        {errorMsg && <div className="body-md text-red-600">{errorMsg}</div>}

        {!errorMsg && (
          <div className="w-full flex flex-col gap-5">
            {items.length > 0 ? (
              items.map((item, index) => {
                if (items.length === index + 1) {
                  return (
                    <div ref={lastElementRef} key={item.id}>
                      <DocRow
                        item={item}
                        tab={tab}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onOpenDetail={onOpenDetail}
                      />
                    </div>
                  );
                }
                return (
                  <DocRow
                    key={item.id}
                    item={item}
                    tab={tab}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onOpenDetail={onOpenDetail}
                  />
                );
              })
            ) : (
              !loading && (
                <div className="body-md text-primary-600">
                  표시할 자료가 없습니다.
                </div>
              )
            )}
          </div>
        )}

        {loading && (
          <div className="body-md text-primary-600">불러오는 중…</div>
        )}
      </div>
    </div>
  );
}
