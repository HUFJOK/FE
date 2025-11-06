import React from "react";
import StarRating from "./StarRating";

interface ReviewBoxProps {
  rating: number;
  date: string;
  content: string;
}

export default function ReviewBox({
  rating,
  date,
  content,
}: ReviewBoxProps): React.JSX.Element {
  return (
    <div className="w-full p-5 bg-gray-100 border border-gray-200 rounded-xl flex flex-col justify-center items-start gap-2.5">
      <div className="flex justify-start items-center gap-2.5">
        <StarRating rating={rating} />
        <div className="text-gray-700 body-sm">{rating.toFixed(1)}</div>
        <div className="text-gray-400 body-sm">{date}</div>
      </div>
      <div className="text-gray-700 body-sm">{content}</div>
    </div>
  );
}
