import React from "react";
import { TbMinimize } from "react-icons/tb";
import { clsx } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";

import { Button, CircleTimer, CompactTimer } from "@/components";
import useStore from "@/store";
import { MainWindowContext } from "@/contexts";
import { Intent } from "@/bindings/Intent";
import { Timer } from "@/hooks/useTimer";

interface Props {
  data: Timer;
}

const TimerView: React.FC<Props> = (props) => {
  const { display, isCompact, toggleIsCompact } =
    React.useContext(MainWindowContext)!;

  const store = useStore();

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
          initial={{ width: "0%", opacity: 0, translateX: 128 }}
          animate={{ width: "100%", opacity: 1, translateX: 0 }}
          exit={{ width: "0%", opacity: 0, translateX: 128 }}
        >
          {isCompact ? (
            <CompactTimer
              displayTimeLeft={displayTimeLeft}
              theme={theme}
              {...props.data}
            />
          ) : (
            <CircleTimer
              displayTimeLeft={displayTimeLeft}
              theme={theme}
              {...props.data}
            />
          )}
          <TimerDetails
            isCompact={isCompact}
            iterations={props.data.iterations}
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
