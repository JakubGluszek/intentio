import React from "react";

import { Timer, TimerIntent } from "@/components";
import { TimerContext } from "@/contexts";
import useStore from "@/store";

interface TimerViewProps { }

export const TimerView: React.FC<TimerViewProps> = () => {
  const store = useStore();
  const timer = React.useContext(TimerContext)!;

  const theme = store.currentTheme;
  const intent = store.currentIntent;

  if (!theme) return null;

  return (
    <div className="grow flex flex-col gap-0.5">
      <Timer {...timer} theme={theme} />
      <TimerIntent data={intent} />
    </div>
  );
};
