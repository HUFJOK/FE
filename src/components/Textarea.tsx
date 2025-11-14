import React from "react";

interface TextareaProps {
  rows?: number;
  id?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Textarea({
  rows = 6,
  id,
  value,
  onChange,
  placeholder,
  disabled = false,
}: TextareaProps): React.JSX.Element {
  return (
    <textarea
      className={`
        w-full min-w-30 p-5 border rounded-xl body-md text-gray-700 resize-none
        ${
          !disabled
            ? "cursor-text bg-white border-gray-400 hover:border-gray-600 focus:border-primary-600 focus:outline-none"
            : "cursor-default bg-gray-100 border-gray-200"
        }
      `}
      rows={rows}
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}
