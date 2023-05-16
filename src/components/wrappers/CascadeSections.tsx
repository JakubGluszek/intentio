import React from "react";
import { motion } from "framer-motion";

interface CascadeSectionsProps {
  children: React.ReactNode;
}

export const CascadeSections: React.FC<CascadeSectionsProps> = ({
  children,
}) => {
  return (
    <motion.div
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
