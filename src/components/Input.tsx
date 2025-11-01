import React from "react";

interface InputProps {
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Input({
  type,
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
}: InputProps): React.JSX.Element {
  return (
    <input
      className={`
        w-full min-w-60 px-5 py-2.5 border rounded-xl body-lg text-gray-700 bg-white
        ${
          !disabled
            ? "cursor-pointer border-gray-400 hover:border-gray-600 active:border-gray-600"
            : "cursor-default border-gray-200 hover:border-gray-200 active:border-gray-200"
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
