import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface PaneProps extends HTMLMotionProps<"div"> {
  withPadding?: boolean;
}

export const Pane: React.FC<PaneProps> = (props) => {
  const {
    children,
    style: customStyle,
    withPadding = true,
    ...restProps
  } = props;

  return (
    <motion.div
      style={{
        display: "flex",
        backgroundColor: "rgb(var(--window-color) / 0.95)",
        borderWidth: 2,
        borderColor: "rgb(var(--base-color) / 0.1)",
        padding: withPadding ? 6 : undefined,
        ...customStyle,
      }}
      {...restProps}
    >
      {children}
    </motion.div>
  );
};
