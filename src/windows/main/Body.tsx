import React from "react";
import { MdTimer } from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";
import { clsx } from "@mantine/core";

import { TimerContext } from "@/contexts";
import { Pane } from "@/ui";
import IntentsView from "./sidebar/intentsView";
import { TimerView } from "./TimerView";
import { SessionSummary } from "./SessionSummary";

export const MainBody: React.FC = () => {
  const [display, setDisplay] = React.useState<"Timer" | "Intents">("Timer");

  const {
    config: timerConfig,
    sessionForCreate,
    clearSessionForCreate,
  } = React.useContext(TimerContext)!;

  if (timerConfig.session_summary && sessionForCreate) {
    return (
      <SessionSummary
        data={sessionForCreate}
        onExit={() => clearSessionForCreate()}
      />
    );
  }

  return (
    <Pane className="relative grow flex flex-col gap-0.5 p-0.5">
      {/* Main panel switcher */}
      <div className="flex flex-row bg-base/10 rounded-sm overflow-clip">
        <PanelButton
          active={display === "Timer"}
          onClick={() => setDisplay("Timer")}
        >
          <MdTimer size={20} />
          <div>Timer</div>
        </PanelButton>
        <PanelButton
          active={display === "Intents"}
          onClick={() => setDisplay("Intents")}
        >
          <BiTargetLock size={20} />
          <div>Intents</div>
        </PanelButton>
      </div>

      {display === "Timer" && <TimerView />}
      {display === "Intents" && <IntentsView />}
    </Pane>
  );
};

interface PanelButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

const PanelButton: React.FC<PanelButtonProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className={clsx(
        "flex-1 flex flex-row items-center justify-center gap-1 font-black p-0.5 transition-colors duration-150 uppercase",
        props.active
          ? "bg-primary/20 text-primary"
          : "bg-transparent text-base hover:text-primary hover:bg-base/10 active:bg-primary/10"
      )}
    >
      {props.children}
    </button>
  );
};
