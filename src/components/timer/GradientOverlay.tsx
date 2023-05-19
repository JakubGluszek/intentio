import React from "react";
import { motion } from "framer-motion";

export const GradientOverlay: React.FC = () => {
  return (
    <motion.div
      className="absolute w-full h-full"
      style={{
        pointerEvents: "none",
        backgroundImage:
          "radial-gradient(circle at center, rgba(var(--primary-color) / 0.2), transparent 100%",
      }}
    ></motion.div>
  );
};
