import React, { useEffect, useRef, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface Option {
  index: number;
  value: string;
}

interface DropdownProps {
  options: Option[];
  value: Option | null;
  onChange: (option: Option) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}: DropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleDropdown = (): void => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleOptionClick = (option: Option): void => {
    if (disabled) return;
    if (onChange) {
      onChange(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative w-full min-w-60" ref={dropdownRef}>
      <div
        className={`
          px-5 py-2.5 flex justify-between items-center border rounded-xl body-lg text-gray-700 bg-white
          ${
            !disabled
              ? isOpen
                ? "cursor-pointer border-primary-600"
                : "cursor-pointer border-gray-400 hover:border-gray-600 active:border-gray-600"
              : "cursor-default border-gray-200 hover:border-gray-200 active:border-gray-200"
          }
        `}
        onClick={handleDropdown}
        aria-expanded={isOpen}
      >
        <div>{value ? value.value : placeholder}</div>
        {!disabled && (
          <>
            {isOpen ? (
              <BiChevronUp className="w-6 h-6 text-primary-700" />
            ) : (
              <BiChevronDown className="w-6 h-6 text-primary-700" />
            )}
          </>
        )}
      </div>

      {!disabled && isOpen && (
        <ul
          className="
            absolute top-full left-0 right-0 z-10 mt-1 max-h-42.5
            border rounded-xl border-gray-400
            list-none overflow-hidden overflow-y-auto
            [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]
          "
        >
          {options.map((option) => (
            <li
              className="
                px-5 py-2.5 body-md text-gray-700 bg-white cursor-pointer
                hover:bg-primary-100
                active:bg-primary-200
              "
              key={option.index}
              onClick={() => handleOptionClick(option)}
              role="option"
              aria-selected={value?.index === option.index}
            >
              {option.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
