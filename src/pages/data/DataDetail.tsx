import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import LabelField from "../../components/LabelField";
import Textarea from "../../components/Textarea";
import Button from "../../components/Button";
import StarRating from "../../components/DataDetail/StarRating";
import RatingInput from "../../components/DataDetail/RatingInput";
import ReviewBox from "../../components/DataDetail/ReviewBox";

export default function DataDetail(): React.JSX.Element {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [semester, setSemester] = useState<number>(0);
  const [professor, setProfessor] = useState<string>("");
  const [grade, setGrade] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [course, setCourse] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isPurchased, setIsPurchased] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(0.0);
  const [reviewText, setReviewText] = useState<string>("");
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    setTitle("2025-1 컴퓨팅 사고 중간고사 족보");
    setPrice(200);
    setYear(2025);
    setSemester(1);
    setProfessor("김외대");
    setGrade("1학년");
    setType("전공");
    setCourse("컴퓨팅 사고");
    setDescription("2025-1 컴퓨팅 사고 중간고사 족보");
    setReviews([
      {
        id: 1,
        rating: 4.7,
        content: "최고예요! 정말 만족합니다.",
        date: "2025.05.16",
      },
      {
        id: 2,
        rating: 4.0,
        content: "최고예요! 정말 만족합니다.",
        date: "2025.05.16",
      },
    ]);
  }, []);

  const handlePurchase = (): void => {
    setIsPurchased(true);
    if(isPurchased) {
      console.log("파일 다운로드");
    } else {
      console.log("파일 구매 완료");
    }
  };

  return (
    <div className="max-w-250 py-7.5 mx-auto">
      <div className="w-full p-10 bg-white border-2 border-primary-500 rounded-xl flex flex-col justify-center items-start gap-7.5">
        <div className="w-full flex justify-between items-center gap-7.5">
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            font="title-sm"
            disabled={true}
          />
          <div className="text-primary-500 title-sm">{price}P</div>
        </div>

        <div className="w-full flex justify-start items-center gap-5">
          <div className="w-43 flex-shrink-0 flex flex-col gap-5">
            <LabelField label="연도" color="gray-700" isFit={true}>
              <Input
                type="text"
                id="year"
                value={year.toString()}
                onChange={(e) => setYear(Number(e.target.value))}
                font="body-md"
                disabled={true}
              />
            </LabelField>
            <LabelField label="학년" color="gray-700" isFit={true}>
              <Input
                type="text"
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
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
                value={semester.toString()}
                onChange={(e) => setSemester(Number(e.target.value))}
                font="body-md"
                disabled={true}
              />
            </LabelField>
            <LabelField label="구분" color="gray-700" isFit={true}>
              <Input
                type="text"
                id="category"
                value={type}
                onChange={(e) => setType(e.target.value)}
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
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                font="body-md"
                disabled={true}
              />
            </LabelField>
            <LabelField label="교과목명" color="gray-700" isFit={true}>
              <Input
                type="text"
                id="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                font="body-md"
                disabled={true}
              />
            </LabelField>
          </div>
        </div>

        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={true}
        />

        <Button
          text={isPurchased ? "다운로드" : "구매"}
          font="body-lg"
          color={600}
          isFull={true}
          onClick={handlePurchase}
        />

        <div className="w-full flex flex-col gap-5">
          <div className="title-sm text-gray-700">후기</div>
          {isPurchased && (
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
                text="작성"
                font="body-sm"
                color={600}
                onClick={() =>
                  console.log("후기 작성:", {
                    rating: reviewRating,
                    text: reviewText,
                  })
                }
              />
            </div>
          )}

          {reviews.map((review) => (
            <ReviewBox
              key={review.id}
              rating={review.rating}
              date={review.date}
              content={review.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
