import React from "react";
import { HTMLMotionProps } from "framer-motion";
import { clsx } from "@mantine/core";
import { twMerge } from "tailwind-merge";

import { Button } from "@/ui";
import { TabsContext } from "./TabsProvider";

export interface TabProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  value: string;
}

export const Tab: React.FC<TabProps> = (props) => {
  const { children, value, className: customClassName, ...restProps } = props;

  const cx = React.useContext(TabsContext);
  const isSelected = cx?.value === props.value;

  let className = clsx(
    "grow duration-150 active:bg-primary active:text-window",
    isSelected
      ? "bg-primary/80 hover:bg-primary/90 text-window hover:text-window shadow-lg shadow-black/40"
      : "bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary shadow shadow-black/40"
  );

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <Button
      variant="ghost"
      onClick={() => cx?.onChange(props.value)}
      className={className}
      {...restProps}
    >
      {props.children}
    </Button>
  );
};
