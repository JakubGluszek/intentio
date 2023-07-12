import React from "react";

import { Timer } from "@/components";
import useStore from "@/store";
import { useTimer } from "@/hooks";

export const TimerView: React.FC = () => {
  const store = useStore();
  const timer = useTimer();

  if (!store.currentTheme || !timer.session || !timer.config) return null;

  return (
    <div className="grow flex flex-col items-center justify-center bg-base/5 border border-base/5">
      <Timer
        type={timer.session._type}
        duration={timer.session.duration * 60}
        isPlaying={timer.session.is_playing}
        skip={timer.skip}
        pause={timer.stop}
        resume={timer.play}
        restart={timer.restart}
        iterations={1}
        elapsedTime={timer.session.time_elapsed}
        config={timer.config}
        theme={store.currentTheme}
        displayCountdown={true}
        toggleDisplayCountdown={() => null}
      />
    </div>
  );
};
