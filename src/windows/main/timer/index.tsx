import React from "react";
import { useNavigate } from "react-router-dom";
import { TbWindowMinimize } from "react-icons/tb";

import { Loader, Timer } from "@/components";
import useStore from "@/store";
import { useTimer } from "@/hooks";
import { Button, IconView } from "@/ui";
import ipc from "@/ipc";

export const TimerView: React.FC = () => {
  const store = useStore();
  const timer = useTimer();
  const navigate = useNavigate();

  if (!store.currentTheme) return null;
  // Loading
  if (timer.session === undefined) return <Loader />;
  // Loading
  if (!timer.config) return <Loader />;

  return (
    <div className="relative grow flex flex-col items-center justify-center bg-base/5">
      {timer.session ? (
        <>
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

          <div className="absolute top-1 right-1">
            <Button variant="ghost" onClick={() => ipc.createTinyTimerWindow()}>
              <IconView icon={TbWindowMinimize} />
            </Button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 text-text/60 text-center p-4">
          <span>Choose your intent in order to create a new timer session</span>
          <Button onClick={() => navigate("/intents")} variant="base">
            Go to intents
          </Button>
        </div>
      )}
    </div>
  );
};
