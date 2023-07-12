import React from "react";

import { Timer } from "@/components";
import useStore from "@/store";
import { useTimer } from "@/hooks";

export const TimerView: React.FC = () => {
  const store = useStore();
  const timer = useTimer();

  const theme = store.currentTheme;

  const [elapsedTimeDetailed, setElapsedTimeDetailed] = React.useState(0);

  console.log(elapsedTimeDetailed);

  React.useEffect(() => {
    if (!timer.session) return;
    setElapsedTimeDetailed(timer.session.time_elapsed);
  }, [timer.session?.time_elapsed]);

  if (!theme || !timer.session) return null;

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
        elapsedTimeDetailed={elapsedTimeDetailed}
        config={{
          auto_start_breaks: false,
          auto_start_focus: false,
          break_duration: 750,
          focus_duration: 1500,
          long_break_duration: 1000,
          long_break_interval: 4,
          session_summary: false,
        }}
        theme={theme}
        displayCountdown={true}
        toggleDisplayCountdown={() => null}
      />
    </div>
  );
};
