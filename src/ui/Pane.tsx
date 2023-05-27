import React from "react";
import {
  motion,
  HTMLMotionProps,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "@mantine/core";

export interface PaneProps extends HTMLMotionProps<"div"> {
  padding?: "sm" | "md" | "lg";
}

export const Pane: React.FC<PaneProps> = (props) => {
  const [isHover, setIsHover] = React.useState(false);

  const {
    children,
    className: customClassName,
    padding = "sm",
    onHoverStart,
    onHoverEnd,
    onMouseMove,
    ...restProps
  } = props;

  let className = clsx(
    "relative flex rounded border-2 border-base/10 bg-window/90",
    padding === "sm" ? "p-1" : padding === "md" ? "p-1" : "p-1.5"
  );

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  const handleMouseMove = ({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) => {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={(e) => {
        // handleMouseMove(e);
        onMouseMove?.(e);
      }}
      onHoverStart={(e, info) => {
        onHoverStart?.(e, info);
        setIsHover(true);
      }}
      onHoverEnd={(e, info) => {
        onHoverEnd?.(e, info);
        setIsHover(false);
      }}
      {...restProps}
    >
      {children}

      {/* On hover gradient effect / THIS MUST BE A TOGGLE ON/OFF OPTION, get's annoying quickly */}
      {/* <motion.div */}
      {/*   className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100" */}
      {/*   style={{ */}
      {/*     background: useMotionTemplate` */}
      {/*       radial-gradient( */}
      {/*         80px circle at ${mouseX}px ${mouseY}px, */}
      {/*         rgba(var(--primary-color) / 0.2), */}
      {/*         transparent 100% */}
      {/*       ) */}
      {/*     `, */}
      {/*   }} */}
      {/* /> */}
    </motion.div>
  );
};
