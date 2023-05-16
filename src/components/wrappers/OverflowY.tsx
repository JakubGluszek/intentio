import React from "react";

interface OverflowYProps {
  children: React.ReactNode;
}

export const OverflowY: React.FC<OverflowYProps> = ({ children }) => {
  return (
    <div className="grow flex flex-col overflow-y-auto">
      <div className="max-h-0 overflow-y">{children}</div>
    </div>
  );
};
