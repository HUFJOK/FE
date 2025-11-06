import React from "react";

interface RatingInputProps {
  id: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function RatingInput({
  id,
  value,
  onChange,
}: RatingInputProps): React.JSX.Element {
  return (
    <input
      type="number"
      id={id}
      step="0.1"
      min="0"
      max="5"
      value={value}
      onChange={onChange}
      className="w-17.5 p-2.5 bg-white border border-gray-400 rounded-xl body-sm text-gray-700 whitespace-nowrap focus:outline-none"
    />
  );
}
