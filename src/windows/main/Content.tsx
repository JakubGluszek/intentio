import React from "react";
import { MdTimer } from "react-icons/md";

import { Pane, Panels } from "@/ui";
import { TimerContext } from "@/contexts";
import IntentsView from "./intentsView";
import { TimerView } from "./TimerView";
import { SessionSummary } from "./SessionSummary";
import { BiTargetLock } from "react-icons/bi";

type DisplayType = "Timer" | "Intents";

export const Content: React.FC = () => {
  const [display, setDisplay] = React.useState<DisplayType>("Timer");

  const { sessionForCreate, clearSessionForCreate, ...timer } =
    React.useContext(TimerContext)!;

  // on "Tab" key press toggle display
  React.useEffect(() => {
    const handleOnKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab")
        setDisplay((prev) => (prev === "Timer" ? "Intents" : "Timer"));
    };

    document.addEventListener("keydown", handleOnKeyDown);
    return () => document.removeEventListener("keydown", handleOnKeyDown);
  }, []);

  if (timer.config.session_summary && sessionForCreate) {
    return (
      <SessionSummary
        data={sessionForCreate}
        onExit={() => clearSessionForCreate()}
      />
    );
  }

  return (
    <Pane className="relative grow flex flex-col gap-0.5 p-0.5">
      <Panels
        value={display}
        onChange={(value) => setDisplay(value as DisplayType)}
      >
        <Panels.Panel value="Timer">
          <MdTimer size={20} />
          <div>Timer</div>
        </Panels.Panel>
        <Panels.Panel value="Intents">
          <BiTargetLock size={20} />
          <div>Intents</div>
        </Panels.Panel>
      </Panels>

      {display === "Timer" && <TimerView />}
      {display === "Intents" && (
        <IntentsView onExit={() => setDisplay("Timer")} />
      )}
    </Pane>
  );
};
