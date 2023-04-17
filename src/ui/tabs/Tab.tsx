import React from "react";
import { HTMLMotionProps } from "framer-motion";

import { Button } from "@/ui";
import { TabsContext } from "./TabsProvider";

export interface TabProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  value: string;
}

export const Tab: React.FC<TabProps> = (props) => {
  const { children, value, style: customStyle, ...restProps } = props;

  const cx = React.useContext(TabsContext);

  const isSelected = cx?.value === props.value;

  const selectedStyle: React.CSSProperties | undefined = isSelected
    ? {
      backgroundColor: "rgb(var(--primary-color))",
      color: "rgb(var(--window-color))",
    }
    : undefined;

  return (
    <Button
      onClick={() => cx?.onChange(props.value)}
      variant="ghost"
      style={{
        flex: 1,
        backgroundColor: "rgb(var(--primary-color) / 0.15)",
        borderRadius: 2,
        ...selectedStyle,
        ...customStyle,
      }}
      {...restProps}
    >
      {props.children}
    </Button>
  );
};
