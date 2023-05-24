import React from "react";
import { motion } from "framer-motion";

export interface PanelViewProps {
  display: boolean;
}

export const PanelView: React.FC<
  PanelViewProps & { children: React.ReactNode }
> = (props) => {
  return (
    <motion.div
      className="grow flex flex-col p-0.5 glass rounded-sm"
      transition={{ duration: 0.3 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {props.children}
    </motion.div>
  );
};
