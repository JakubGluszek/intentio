import React from "react";
import { motion } from "framer-motion";

import { Timer } from "@/components";
import { TimerContext } from "@/contexts";
import useStore from "@/store";

interface TimerViewProps {
  display: boolean;
}

export const TimerView: React.FC<TimerViewProps> = (props) => {
  const store = useStore();
  const timerCtx = React.useContext(TimerContext)!;

  const theme = store.currentTheme;

  if (!props.display || !theme) return null;

  return (
    <motion.div
      className="grow flex flex-col glass rounded-sm"
      transition={{ duration: 0.2, delay: 0.1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Timer {...timerCtx} theme={theme} />
    </motion.div>
  );
};
