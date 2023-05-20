import React from "react";
import { motion } from "framer-motion";

interface SectionsWrapperProps {
  children: React.ReactNode;
}

export const SectionsWrapper: React.FC<SectionsWrapperProps> = ({
  children,
}) => {
  return (
    <motion.div
      className="flex flex-col gap-0.5"
      variants={{
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
            when: "beforeChildren",
          },
        },
        hidden: {
          opacity: 0,
        },
      }}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
};
