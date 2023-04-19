import React from "react";
import { HTMLMotionProps } from "framer-motion";

import { Button } from "@/ui";
import { TabsContext } from "./TabsProvider";
import { clsx } from "@mantine/core";

export interface TabProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  value: string;
}

export const Tab: React.FC<TabProps> = (props) => {
  const { children, value, style: customStyle, ...restProps } = props;

  const cx = React.useContext(TabsContext);
  const isSelected = cx?.value === props.value;

  return (
    <Button
      {...restProps}
      variant="ghost"
      onClick={() => cx?.onChange(props.value)}
      className={clsx(
        isSelected ? "shadow-lg shadow-black/40" : "shadow shadow-black/40"
      )}
      style={{
        flex: 1,
        backgroundColor: isSelected
          ? "rgb(var(--primary-color))"
          : "rgb(var(--primary-color) / 0.15)",
        color: isSelected
          ? "rgb(var(--window-color))"
          : "rgb(var(--primary-color))",
        borderRadius: 2,
        ...customStyle,
      }}
    >
      {props.children}
    </Button>
  );
};
