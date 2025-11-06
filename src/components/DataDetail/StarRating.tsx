import React from "react";
import { AiFillStar } from "react-icons/ai";

interface StarRatingProps {
  rating: number;
}

export default function StarRating({
  rating,
}: StarRatingProps): React.JSX.Element {
  const stars: React.ReactElement[] = [];
  const roundedRating = Math.round(rating);

  for (let i = 1; i <= 5; i++) {
    const isFilled = i <= roundedRating;
    stars.push(
      <AiFillStar
        key={i}
        className={`w-4 h-4 ${isFilled ? "text-primary-600" : "text-gray-400"}`}
      />,
    );
  }

  return <div className="flex">{stars}</div>;
}
