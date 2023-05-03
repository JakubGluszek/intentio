import React from "react";
import { Tooltip as TooltipMantine, TooltipProps } from "@mantine/core";
import { twMerge } from "tailwind-merge";

export const Tooltip: React.FC<TooltipProps> = (props) => {
  const { children, className: customClassName, style, ...restProps } = props;

  let className =
    "bg-window font-semibold text-sm text-primary/80 rounded-sm shadow-lg shadow-black/30 px-2 uppercase";

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <TooltipMantine
      openDelay={100}
      {...restProps}
      classNames={{ tooltip: className }}
      style={{ paddingBottom: 0, ...style }}
    >
      <div>{children}</div>
    </TooltipMantine>
  );
};
