import React from "react";

import { useTimer } from "@/hooks";
import { Button, Pane } from "@/ui";
import { listen } from "@tauri-apps/api/event";

type SessionType = "Focus" | "Break" | "LongBreak";

interface TimerState {
  _type: SessionType;
  is_playing: boolean;
  duration: number;
  time_elapsed: number;
  started_at: number | null;
}

const TestTimerWindow: React.FC = () => {
  const timer = useTimer();

  React.useEffect(() => {
    const listener = listen<TimerState>("timer_session_updated", (event) => {
      console.log(event.payload);
    });
    return () => {
      listener.then((f) => f()) as never;
    };
  }, []);

  return (
    <Pane className="w-screen h-screen flex flex-col gap-0.5">
      <Button variant="base" onClick={timer.play}>
        Play
      </Button>
      <Button variant="base" onClick={timer.stop}>
        Stop
      </Button>
      <Button variant="base" onClick={timer.restart}>
        Restart
      </Button>
      <Button variant="base" onClick={timer.skip}>
        Skip
      </Button>
      <Button variant="base" onClick={() => timer.setIntent(1)}>
        Set intent
      </Button>
    </Pane>
  );
};

export default TestTimerWindow;
