import React from "react";

import { Timer } from "@/components";
import useStore from "@/store";
import { MainWrapper } from "../MainWrapper";
import { useTimer } from "@/hooks";

export const TimerView: React.FC = () => {
  const store = useStore();
  const timer = useTimer();

  const theme = store.currentTheme;

  console.log(timer.session);

  if (!theme || !timer.session) return null;

  return (
    <MainWrapper>
      <div className="grow flex flex-col items-center justify-center bg-base/5 border border-base/5">
        <Timer
          type="Focus"
          duration={timer.session.duration}
          isPlaying={false}
          skip={() => null}
          pause={() => null}
          resume={() => null}
          restart={() => null}
          iterations={1}
          elapsedTime={0}
          elapsedTimeDetailed={0}
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
    </MainWrapper>
  );
};
