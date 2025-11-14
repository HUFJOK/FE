import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/Input";
import LabelField from "../../components/LabelField";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import StarRating from "../../components/DataDetail/StarRating";
import RatingInput from "../../components/DataDetail/RatingInput";
import ReviewBox from "../../components/DataDetail/ReviewBox";
import type { MaterialGetResponse, UserResponse, ReviewResponse, ReviewCreateRequest, ReviewUpdateRequest } from "../../api/types";
import { deleteMaterial, downloadMaterial, getMaterial, purchaseMaterial } from "../../api/materials";
import { createReview, updateReview, deleteReview, getReviews } from "../../api/reviews";
import { getMyDownloadedMaterials, getUser } from "../../api/users";
import { usePointStore } from "../../store/pointStore";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export default function DataDetail(): React.JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const materialId = Number(id);
  const fetchPoint = usePointStore((state) => state.fetchPoint);

  const [material, setMaterial] = useState<MaterialGetResponse | null>(null);
  const [myReview, setMyReview] = useState<ReviewResponse | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [currentUser, setCurrentUser] = useState<UserResponse | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(0.0);
  const [reviewText, setReviewText] = useState<string>("");
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const [isReviewEdit, setIsReviewEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDataDetail = async () => {
      if (isNaN(materialId)) {
        setError("유효하지 않은 자료 ID입니다");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const [materialData, reviewsData, userData, purchasedData] = await Promise.all([
          getMaterial(materialId),
          getReviews(materialId),
          getUser(),
          getMyDownloadedMaterials(),
        ]);

        setMaterial(materialData);
        setCurrentUser(userData);

        if (userData && materialData) {
          setIsAuthor(userData.nickname === materialData.authorName);
        }

        if (purchasedData.materials.some((m) => m.id === materialId)) {
          setIsPurchased(true);
        }

        const myReviewData = reviewsData.find((review) => review.author === true);
        if (myReviewData) {
          setMyReview(myReviewData);
          setReviews(reviewsData.filter((review) => review.author !== true));
        } else {
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("자료 로딩 실패:", error);
        setError("자료 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataDetail();
  }, [materialId]);

  const handleDownload = async (): Promise<void> => {
    if (!material) return;

    if (!material.attachments || material.attachments.length === 0) {
      alert("다운로드할 파일이 없습니다.");
      return;
    }

    setIsLoading(true);
    try {
      if (material.attachments.length === 1) {
        const attachment = material.attachments[0];
        const file = await downloadMaterial(material.materialId, attachment.id);

        if ("blob" in file) {
          saveAs(file.blob, file.filename);
        } else {
          throw new Error(file.error || "파일을 다운로드하는 데 실패했습니다.");
        }
      } else {
        const zip = new JSZip();

        for (const attachment of material.attachments) {
          const file = await downloadMaterial(material.materialId, attachment.id);

          if ("blob" in file) {
            zip.file(attachment.originalFileName, file.blob);
          } else {
            console.warn(`'${attachment.originalFileName}' 파일 다운로드에 실패하여 압축에서 제외합니다.`);
          }
        }

        const zipBlob = await zip.generateAsync({ type: "blob" });
        saveAs(zipBlob, `${material.title}.zip`);
      }
    } catch (err) {
      console.error("파일 다운로드 실패:", err);
      alert("다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (): Promise<void> => {
    if (window.confirm("정말로 구매하시겠습니까? 포인트가 차감됩니다.")) {
      try {
        await purchaseMaterial(materialId);
        fetchPoint();
        setIsPurchased(true);
        alert("구매가 완료되었습니다. 파일을 다운로드해주세요.");
      } catch (error) {
        console.error("구매 실패:", error);
        alert("구매에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (window.confirm("정말로 자료를 삭제하시겠습니까?")) {
      try {
        await deleteMaterial(materialId);
        alert("자료가 성공적으로 삭제되었습니다.");
        navigate(-1);
      } catch (error) {
        console.error("자료 삭제 실패:", error);
        alert("자료 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  const handleReviewWrite = async (): Promise<void> => {
    if (!reviewText || !reviewRating) {
      alert("후기 내용을 입력해주세요.");
      return;
    }

    try {
      if (isReviewEdit && myReview) {
        const reviewData: ReviewUpdateRequest = {
          rating: reviewRating,
          comment: reviewText,
        };

        await updateReview(myReview.reviewId, reviewData);
        const editReview = {
          ...myReview,
          rating: reviewRating,
          comment: reviewText,
        };

        setMyReview(editReview);
        setReviewText("");
        setReviewRating(0.0);
        setIsReviewEdit(false);
        alert("후기가 성공적으로 수정되었습니다.");
      } else {
        const reviewData: ReviewCreateRequest = {
          materialId,
          rating: reviewRating,
          comment: reviewText,
        };

        const newReview = await createReview(reviewData);
        const formatNewReview = {
          ...newReview,
          reviewerEmail: currentUser?.email || "",
          author: true,
        };

        setMyReview(formatNewReview);
        setReviewText("");
        setReviewRating(0.0);
        alert("후기가 성공적으로 작성되었습니다.");
      }
    } catch (error) {
      console.error("후기 작성 실패:", error);
      alert("후기 작성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleReviewCancel = (): void => {
    setIsReviewEdit(false);
    setReviewText("");
    setReviewRating(0.0);
  };

  const handleReviewEdit = (): void => {
    if (!myReview) return;

    setIsReviewEdit(true);
    setReviewText(myReview.comment);
    setReviewRating(myReview.rating);
  };

  const handleReviewDelete = async (reviewId: number): Promise<void> => {
    if (window.confirm("정말로 후기를 삭제하시겠습니까?")) {
      try {
        await deleteReview(reviewId);
        setMyReview(null);
        alert("후기가 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("후기 삭제 실패:", error);
        alert("후기 삭제에 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center title-sm text-primary-600">
        <div>로딩 중입니다...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center title-sm text-red-500">
        <div>{error}</div>
      </main>
    );
  }

  if (!material) {
    return (
      <main className="min-h-screen w-full flex justify-center items-center title-sm text-primary-600">
        <div>자료 정보를 찾을 수 없습니다.</div>
      </main>
    );
  }

  return (
    <div className="max-w-250 py-7.5 mx-auto">
      <div className="w-full p-10 bg-white border-2 border-primary-500 rounded-xl flex flex-col justify-center items-start gap-7.5">
        <div className="w-full flex justify-between items-center gap-7.5">
          <Input
            type="text"
            id="title"
            value={material.title}
            font="title-sm"
            disabled={true}
          />
          <div className="text-primary-500 title-sm">200P</div>
        </div>

        <div className="w-full flex flex-col justify-start items-center gap-5">
          <div className="w-full flex justify-start items-center gap-5">
            <div className="w-43 flex-shrink-0 flex flex-col gap-5">
              <LabelField label="연도" color="gray-700" isFit={true}>
                <Input
                  type="text"
                  id="year"
                  value={material.year.toString()}
                  font="body-md"
                  disabled={true}
                />
              </LabelField>
              <LabelField label="학년" color="gray-700" isFit={true}>
                <Input
                  type="text"
                  id="grade"
                  value={material.grade}
                  font="body-md"
                  disabled={true}
                />
              </LabelField>
            </div>
            <div className="w-43 flex-shrink-0 flex flex-col gap-5">
              <LabelField label="학기" color="gray-700" isFit={true}>
                <Input
                  type="text"
                  id="semester"
                  value={material.semester.toString()}
                  font="body-md"
                  disabled={true}
                />
              </LabelField>
              <LabelField label="구분" color="gray-700" isFit={true}>
                <Input
                  type="text"
                  id="type"
                  value={material.courseDivision}
                  font="body-md"
                  disabled={true}
                />
              </LabelField>
            </div>
            <div className="flex-grow flex flex-col gap-5">
              <LabelField label="담당교수" color="gray-700" isFit={true}>
                <Input
                  type="text"
                  id="professor"
                  value={material.professorName}
                  font="body-md"
                  disabled={true}
                />
              </LabelField>
              <LabelField label="교과목명" color="gray-700" isFit={true}>
                <Input
                  type="text"
                  id="course"
                  value={material.courseName}
                  font="body-md"
                  disabled={true}
                />
              </LabelField>
            </div>
          </div>
          <LabelField label="전공" color="gray-700" isFit={true}>
            <Input
              type="text"
              id="major"
              value={material.major || ""}
              font="body-md"
              disabled={true}
            />
          </LabelField>
        </div>

        <Textarea
          id="description"
          value={material?.description || ""}
          disabled={true}
        />

        {material?.attachments && material.attachments.length > 0 && (
          <ul className="w-full flex flex-col justify-start items-start gap-2.5">
            {material.attachments.map((file) => (
              <li key={file.id} className="flex justify-start items-center">
                {file.originalFileName}
              </li>
            ))}
          </ul>
        )}

        {isAuthor
          ? (
            <div className="w-full flex justify-center items-center gap-2.5">
              <Button text="다운로드" font="body-lg" color={600} isFull={true} onClick={handleDownload} />
              <Button text="수정" font="body-lg" color={600} isFull={true} onClick={() => navigate(`/data/edit/${materialId}`)} />
              <Button text="삭제" font="body-lg" color={600} isFull={true} onClick={handleDelete} />
            </div>
          ) : (
            <div className="w-full flex flex-col justify-start items-center gap-2.5">
              <Button
                text={isPurchased ? "다운로드" : "구매"}
                font="body-lg"
                color={600}
                isFull={true}
                onClick={isPurchased ? handleDownload : handlePurchase}
              />
              <div className="caption text-red-500">
                게시자가 삭제 시 다운로드 불가하니 즉시 다운받으시길 바랍니다.
              </div>
            </div>
          )}

        <div className="w-full flex flex-col gap-5">
          <div className="title-sm text-gray-700">후기</div>
          {isPurchased && !isAuthor && (isReviewEdit || !myReview) && (
            <div className="flex justify-start items-center gap-2.5">
              <StarRating rating={reviewRating} />
              <RatingInput
                id="reviewRating"
                value={reviewRating}
                onChange={(e) => setReviewRating(Number(e.target.value))}
              />
              <Input
                type="text"
                id="reviewText"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="후기를 작성해주세요"
                font="body-sm"
              />
              <Button
                text={isReviewEdit ? "수정" : "작성"}
                font="body-sm"
                color={600}
                onClick={handleReviewWrite}
              />
              {isReviewEdit && (
                <Button
                  text="취소"
                  font="body-sm"
                  color={600}
                  isOutline={true}
                  onClick={handleReviewCancel}
                />
              )}
            </div>
          )}

          {myReview && !isReviewEdit && <ReviewBox
            rating={myReview.rating}
            date={myReview.createdAt}
            content={myReview.comment}
            isAuthor={myReview.author}
            onEdit={handleReviewEdit}
            onDelete={() => handleReviewDelete(myReview.reviewId)}
          />}

          {reviews.map((review) => (
            <ReviewBox
              key={review.reviewId}
              rating={review.rating}
              date={review.createdAt}
              content={review.comment}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
