import React from "react";
import { motion, HTMLMotionProps, useMotionValue, useMotionTemplate } from "framer-motion";
import { twMerge } from "tailwind-merge";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const {
      children,
      className: customClassName,
      onMouseMove,
      ...restProps
    } = props;

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({
      currentTarget,
      clientX,
      clientY,
    }: React.MouseEvent) {
      let { left, top } = currentTarget.getBoundingClientRect();

      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    let className =
      "relative group flex flex-col border-2 border-base/10 hover:border-base/20 text-sm\
      bg-base/10 p-1.5 rounded-sm transition-all duration-150 hover:shadow hover:shadow-black/40";

    if (customClassName) {
      className = twMerge(className, customClassName);
    }

    return (
      <motion.div
        ref={ref}
        className={className}
        onMouseMove={(e) => {
          handleMouseMove(e);
          onMouseMove?.(e);
        }}
        {...restProps}
      >
        {children}

        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
          style={{
            background: useMotionTemplate`
            radial-gradient(
              200px circle at ${mouseX}px ${mouseY}px,
              rgba(var(--base-color) / 0.15),
              transparent 80%
            )
          `,
          }}
        />
      </motion.div>
    );
  }
);
