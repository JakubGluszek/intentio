import React from "react";
import { BiTargetLock } from "react-icons/bi";

import { Timer } from "@/components";
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
      {intent && (
        <div
          className="relative h-8 flex flex-row bg-base/10 hover:bg-base/20 transition-colors duration-150 cursor-pointer"
          data-tauri-disable-drag
        >
          <div className="w-full flex flex-row items-center justify-center gap-1">
            <BiTargetLock size={20} />
            <span className="text-text/80 font-semibold">{intent.label}</span>
          </div>
        </div>
      )}
    </div>
  );
};
