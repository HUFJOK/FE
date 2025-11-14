import React, { useEffect, useRef, useState } from "react";
import { BiChevronDown, BiChevronUp } from "react-icons/bi";

interface HistoryItem {
  id: number;
  description: string;
  date: string;
  amount: number;
}

interface PointDropdownProps {
  point: number;
  history: HistoryItem[];
}

export default function PointDropdown({
  point,
  history,
}: PointDropdownProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatAmount = (amount: number) => {
    const sign = amount > 0 ? "+" : "-";
    const color = amount > 0 ? "text-primary-400" : "text-gray-400";
    return (
      <div className={color}>
        {sign}
        {Math.abs(amount)}P
      </div>
    );
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="px-5 py-2.5 flex justify-between items-center body-lg text-gray-700 cursor-pointer"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div>{point}P</div>
        {isOpen ? (
          <BiChevronUp size={24} className="text-primary-700" />
        ) : (
          <BiChevronDown size={24} className="text-primary-700" />
        )}
      </div>

      {isOpen && (
        <ul className="absolute top-full left-0 right-0 z-10 mt-5 pb-12.5 list-none">
          {history.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center px-5 pb-5"
            >
              <div className="flex flex-col justify-center items-start gap-1.25">
                <div className="body-sm text-gray-700 font-medium">
                  {item.description}
                </div>
                <div className="caption text-gray-600">{item.date}</div>
              </div>
              <div className="body-md">{formatAmount(item.amount)}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
