import React from "react";

interface LabelFieldProps {
  label: string;
  color?: string;
  isFit?: boolean;
  children: React.ReactNode;
}

export default function LabelField({
  label,
  color = "primary-600",
  isFit = false,
  children,
}: LabelFieldProps): React.JSX.Element {
  return (
    <div className="w-full flex justify-start items-center gap-5">
      <div
        className={`flex-shrink-0 body-lg text-${color} text-left ${isFit ? "w-fit" : "w-40"}`}
      >
        {label}
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
