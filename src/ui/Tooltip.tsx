import React from "react";
import { Tooltip as TooltipMantine, TooltipProps } from "@mantine/core";
import { twMerge } from "tailwind-merge";

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const { children, className: customClassName, style, ...restProps } = props;

  let className =
    "z-[999] bg-window text-primary border-b-2 border-primary/80 font-semibold text-xs rounded-[1px] shadow-xl shadow-black/80 px-2 uppercase";

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <TooltipMantine
      openDelay={300}
      {...restProps}
      classNames={{ tooltip: className }}
      style={{ paddingBottom: 0, ...style }}
    >
      <div>{children}</div>
    </TooltipMantine>
  );
};
