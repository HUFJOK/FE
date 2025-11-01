import React from "react";

interface InfoRowProps {
  label: string;
  children: React.ReactNode; // Input, Dropdown, PointDropdown 등 어떤 요소든 받을 수 있도록 정의
}

export default function InfoRow({
  label,
  children,
}: InfoRowProps): React.JSX.Element {
  return (
    <div className="w-full flex items-center gap-5">
      <div className="w-40 flex-shrink-0 body-lg text-primary-600 text-left">
        {label}
      </div>
      <div className="flex-grow">{children}</div>
    </div>
  );
}
