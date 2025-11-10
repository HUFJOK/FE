import React from "react";

interface ButtonProps {
  text: string;
  font: string;
  color?: number;
  isOutline?: boolean;
  isFull?: boolean;
  onClick?: () => void;
}

export default function Button({
  text,
  font,
  color = 600,
  isOutline = false,
  isFull = false,
  onClick,
}: ButtonProps): React.JSX.Element {
  const getButtonClasses = () => {
    const isTitleFont: boolean = font === "title-md";
    const isSmallFont: boolean = font === "body-sm";

    const baseClasses = `${isFull ? "w-full" : isSmallFont ? "w-fit" : "min-w-30"} ${isTitleFont ? "p-5" : "px-5 py-2.5"} btn ${font} border-2`;
    const outlineClasses = `${baseClasses} bg-white hover:bg-gray-100 active:bg-gray-200`;
    const fillClasses = `${baseClasses} text-white`;

    if (isOutline) {
      switch (color) {
        case 100:
          return `${outlineClasses} border-primary-100 text-primary-100`;
        case 200:
          return `${outlineClasses} border-primary-200 text-primary-200`;
        case 300:
          return `${outlineClasses} border-primary-300 text-primary-300`;
        case 400:
          return `${outlineClasses} border-primary-400 text-primary-400`;
        case 500:
          return `${outlineClasses} border-primary-500 text-primary-500`;
        case 600:
          return `${outlineClasses} border-primary-600 text-primary-600`;
        case 700:
          return `${outlineClasses} border-primary-700 text-primary-700`;
        default:
          return `${outlineClasses} border-primary-600 text-primary-600`;
      }
    } else {
      switch (color) {
        case 100:
          return `${fillClasses} bg-primary-100 border-primary-100 hover:bg-secondary-100 hover:border-secondary-100 active:bg-primary-200 active:border-primary-200`;
        case 200:
          return `${fillClasses} bg-primary-200 border-primary-200 hover:bg-secondary-200 hover:border-secondary-200 active:bg-primary-300 active:border-primary-300`;
        case 300:
          return `${fillClasses} bg-primary-300 border-primary-300 hover:bg-secondary-300 hover:border-secondary-300 active:bg-primary-400 active:border-primary-400`;
        case 400:
          return `${fillClasses} bg-primary-400 border-primary-400 hover:bg-secondary-400 hover:border-secondary-400 active:bg-primary-500 active:border-primary-500`;
        case 500:
          return `${fillClasses} bg-primary-500 border-primary-500 hover:bg-secondary-500 hover:border-secondary-500 active:bg-primary-600 active:border-primary-600`;
        case 600:
          return `${fillClasses} bg-primary-600 border-primary-600 hover:bg-secondary-600 hover:border-secondary-600 active:bg-primary-700 active:border-primary-700`;
        case 700:
          return `${fillClasses} bg-primary-700 border-primary-700 hover:bg-secondary-700 hover:border-secondary-700 active:bg-secondary-700 active:border-secondary-700`;
        default:
          return `${fillClasses} bg-primary-600 border-primary-600 hover:bg-secondary-600 hover:border-secondary-600 active:bg-primary-700 active:border-primary-700`;
      }
    }
  };

  return (
    <div className={getButtonClasses()} onClick={onClick}>
      {text}
    </div>
  );
}
