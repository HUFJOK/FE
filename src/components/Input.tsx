import React from "react";

interface InputProps {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  font?: string;
}

export default function Input({
  type,
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
  font = "body-lg",
}: InputProps): React.JSX.Element {
  const isTitleFont: boolean = font.startsWith("title");
  const isSmallFont: boolean = font === "body-sm";

  return (
    <input
      className={`
        w-full min-w-30 ${isTitleFont ? "p-5" : isSmallFont ? "p-2.5" : "px-5 py-2.5"} border rounded-xl ${font} text-gray-700 whitespace-nowrap
        ${
          !disabled
            ? "cursor-text bg-white border-gray-400 hover:border-gray-600 focus:border-gray-600 focus:outline-none"
            : "cursor-default bg-gray-100 border-gray-200"
        }
      `}
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
