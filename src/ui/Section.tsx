import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { MdLabelImportant } from "react-icons/md";

export interface SectionProps extends HTMLMotionProps<"section"> {
  heading?: React.ReactNode | string;
}

export const Section: React.FC<SectionProps> = (props) => {
  const { children, heading, className: customClassName, ...restProps } = props;

  let className = "flex flex-col gap-2 p-1 rounded-sm";

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <motion.section
      className={className}
      transition={{ duration: 0.3, ease: "linear" }}
      variants={{
        hidden: { opacity: 0, scale: 0.95, y: 16 },
        visible: { opacity: 1, scale: 1, y: 0 },
      }}
      {...restProps}
    >
      {typeof heading === "string" ? (
        <div className="section-heading">
          <MdLabelImportant size={24} />
          <div>{heading}</div>
        </div>
      ) : (
        heading
      )}
      <div className="flex flex-col gap-1.5">{children}</div>
    </motion.section>
  );
};
