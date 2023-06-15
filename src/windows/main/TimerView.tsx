import React from "react";

import { Timer } from "@/components";
import { TimerContext } from "@/contexts";
import useStore from "@/store";
import { Glass } from "@/ui";

interface TimerViewProps {
  display: boolean;
}

export const TimerView: React.FC<TimerViewProps> = (props) => {
  const store = useStore();
  const timerCtx = React.useContext(TimerContext)!;

  const theme = store.currentTheme;

  if (!props.display || !theme) return null;

  return (
    <Glass
      className="grow flex flex-col"
      transition={{ duration: 0.2, delay: 0.1 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Timer {...timerCtx} theme={theme} />
    </Glass>
  );
};
