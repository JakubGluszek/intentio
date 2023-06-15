import React from "react";

interface ScrollAreaProps {
  children: React.ReactNode;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ children }) => {
  return (
    <div className="grow flex flex-col overflow-y-auto">
      <div className="max-h-0 overflow-y">{children}</div>
    </div>
  );
};
