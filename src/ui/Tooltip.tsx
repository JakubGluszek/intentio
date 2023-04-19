import React from "react";
import { Tooltip as TooltipMantine, TooltipProps } from "@mantine/core";
import { twMerge } from "tailwind-merge";

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const { children, className: customClassName, style, ...restProps } = props;

  let className =
    "bg-window text-text rounded border-2 shadow-lg shadow-black/60 border-base px-2";

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <TooltipMantine
      {...restProps}
      classNames={{ tooltip: className }}
      style={{ paddingBottom: 0, ...style }}
    >
      {children}
    </TooltipMantine>
  );
};
