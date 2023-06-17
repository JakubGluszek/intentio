import React from "react";

import { useTimer } from "@/hooks";
import { Button, Pane } from "@/ui";
import ipc from "@/ipc";
import { Intent } from "@/bindings/Intent";

const TestTimerWindow: React.FC = () => {
  const [intent, setIntent] = React.useState<Intent>();

  const timer = useTimer();

  React.useEffect(() => {
    ipc.getIntent(1).then((data) => setIntent(data));
  }, []);

  if (!intent) return null;

  return (
    <Pane className="w-screen h-screen flex flex-row gap-0.5">
      <div className="flex-1 flex flex-col gap-0.5">
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
        <Button variant="base" onClick={() => timer.setIntent(intent)}>
          Set intent
        </Button>
      </div>

      <div className="flex-1 flex flex-col gap-0.5">
        <Button
          variant="base"
          onClick={() =>
            timer.addToQueue({
              duration: Math.floor(Math.random() * 90) + 1,
              intent,
              iterations: Math.floor(Math.random() * 8) + 1,
            })
          }
        >
          Add to queue
        </Button>
        <Button variant="base" onClick={() => timer.removeFromQueue(0)}>
          Remove from queue
        </Button>
        <Button variant="base" onClick={() => timer.reorderQueue(0, 1)}>
          Reorder queue
        </Button>
        <Button variant="base" onClick={timer.clearQueue}>
          Clear queue
        </Button>
        <Button
          variant="base"
          onClick={() => timer.incrementQueueSessionIterations(0)}
        >
          Increment queue session iterations
        </Button>
        <Button
          variant="base"
          onClick={() => timer.decrementQueueSessionIterations(0)}
        >
          Decrement queue session iterations
        </Button>
        <Button
          variant="base"
          onClick={() => timer.updateQueueSessionDuration(0, 90)}
        >
          Update queue session duration
        </Button>
      </div>
    </Pane>
  );
};

export default TestTimerWindow;
