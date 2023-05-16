import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface SectionProps extends HTMLMotionProps<"section"> {
  heading?: React.ReactNode | string;
}

export const Section: React.FC<SectionProps> = (props) => {
  const { children, heading, ...restProps } = props;

  let className = "flex flex-col gap-2 p-1";

  return (
    <motion.section
      className={className}
      transition={{ duration: 0.2 }}
      variants={{
        visible: { opacity: 1, x: 0 },
        hidden: { opacity: 0, x: 32 },
      }}
      {...restProps}
    >
      {typeof heading === "string" ? (
        <div className="w-fit text-center section-heading">{heading}</div>
      ) : (
        heading
      )}
      <div className="flex flex-col gap-1.5">{children}</div>
    </motion.section>
  );
};
