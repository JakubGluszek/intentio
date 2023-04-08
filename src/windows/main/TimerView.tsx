import React from "react";
import { TbMinimize } from "react-icons/tb";
import { clsx } from "@mantine/core";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import utils from "@/utils";
import ipc from "@/ipc";
import { useTimer } from "@/hooks";
import { Button, CircleTimer, CompactTimer } from "@/components";
import useStore from "@/store";
import { MainWindowContext } from "@/contexts";
import { TimerConfig } from "@/bindings/TimerConfig";
import { Intent } from "@/bindings/Intent";

interface Props {
  config: TimerConfig;
}

const TimerView: React.FC<Props> = (props) => {
  const { display, isCompact, toggleIsCompact } =
    React.useContext(MainWindowContext)!;

  const store = useStore();

  const timer = useTimer(props.config, {
    onStateUpdate: (state) =>
      ipc.updateTimerState({
        session_type: state.type,
        is_playing: state.isPlaying,
      }),
    onSaveSession: (session) => {
      if (
        session.type === "Focus" &&
        session.elapsedTime &&
        session.elapsedTime >= 60 &&
        session.startedAt
      ) {
        ipc
          .createSession({
            duration: ~~(session.elapsedTime! / 60),
            started_at: session.startedAt,
            intent_id: store.currentIntent?.id!,
          })
          .then(() => toast("Session saved"));
      }
    },
    onCompleted: (session) => {
      ipc.playAudio();

      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_end
            : script.run_on_break_end) &&
          utils.executeScript(script.body)
      );
    },
    onResumed: (session) => {
      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_start
            : script.run_on_break_start) &&
          utils.executeScript(script.body)
      );
    },
    onPaused: (session) => {
      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_pause
            : script.run_on_break_pause) &&
          utils.executeScript(script.body)
      );
    },
  });

  const displayTimeLeft =
    store.interfaceConfig?.display_timer_countdown ?? true;
  const theme = store.currentTheme;

  if (!theme) return null;

  return (
    <AnimatePresence initial={false}>
      {display === "timer" && (
        <motion.div
          className="grow flex flex-col gap-0.5"
          transition={{ duration: 0.3 }}
          initial={{ width: "0%", opacity: 0 }}
          animate={{ width: "100%", opacity: 1 }}
          exit={{ width: "0%", opacity: 0, translateX: 128 }}
        >
          {isCompact ? (
            <CompactTimer
              displayTimeLeft={displayTimeLeft}
              theme={theme}
              {...timer}
            />
          ) : (
            <CircleTimer
              displayTimeLeft={displayTimeLeft}
              theme={theme}
              {...timer}
            />
          )}
          <TimerDetails
            isCompact={isCompact}
            iterations={timer.iterations}
            intent={store.currentIntent}
            toggleIsCompact={toggleIsCompact}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface TimerDetailsProps {
  isCompact: boolean;
  iterations: number;
  intent?: Intent;
  toggleIsCompact: () => void;
}

const TimerDetails: React.FC<TimerDetailsProps> = (props) => {
  return (
    <div className="w-full flex flex-row items-center justify-between gap-0.5 window rounded rounded-t-none overflow-clip">
      {/* --- Total timer iterations --- */}
      <span
        className={clsx(
          "text-primary/80 font-bold text-center",
          props.isCompact ? "p-0.5 text-sm" : "p-1.5"
        )}
      >
        #{props.iterations}
      </span>
      {/* --- Current intent label --- */}
      {props.intent ? (
        <motion.div
          className={clsx(
            "w-full flex flex-row items-center justify-center gap-1 text-text/80",
            props.isCompact ? "p-0.5 text-sm" : "p-1.5"
          )}
          transition={{ delay: 0.2, duration: 0.2 }}
          initial={{ opacity: 0, display: "none" }}
          animate={{ opacity: 1, display: "flex" }}
        >
          <span>{props.intent.label}</span>
        </motion.div>
      ) : null}
      {/* --- Toggle window compact mode button --- */}
      <div className="flex flex-row items-center gap-1">
        <Button transparent onClick={props.toggleIsCompact} rounded={false}>
          <TbMinimize size={props.isCompact ? 20 : 28} />
        </Button>
      </div>
    </div>
  );
};

export default TimerView;
