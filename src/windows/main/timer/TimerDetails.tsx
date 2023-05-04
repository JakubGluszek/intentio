import React from "react";
import utils from "@/utils";
import { clsx } from "@mantine/core";

import { useTimerReturnValues } from "./useTimer";

export interface TimerDetails extends useTimerReturnValues {
  config: {
    display: boolean;
    hideCountdown: boolean;
  };
  onHideCountdownChange: () => void;
}

export const TimerDetails: React.FC<TimerDetails> = (props) => {
  const { config } = props;

  const formattedTimeLeft = utils.formatTimer(
    props.duration - props.elapsedTime
  );

  const sessionType =
    props.type === "Focus"
      ? "Focus"
      : props.type === "Break"
        ? "Break"
        : "Long break";

  if (!config.display) return null;

  if (config.hideCountdown)
    return (
      <button
        onClick={() => props.onHideCountdownChange()}
        className={clsx(
          "text-3xl font-bold whitespace-nowrap transition-colors duration-150",
          props.isPlaying
            ? "text-primary/80 hover:text-primary"
            : "text-base/80 hover:text-[rgb(var(--base-color))]"
        )}
        tabIndex={-3}
      >
        {sessionType}
      </button>
    );

  return (
    <div className="translate-y-2 flex flex-col items-center">
      <button
        className={clsx(
          "text-3xl font-semibold font-mono transition-colors duration-150",
          props.isPlaying
            ? "text-primary/80 hover:text-primary"
            : "text-base/80 hover:text-[rgb(var(--base-color))]"
        )}
        onClick={() => props.onHideCountdownChange()}
        tabIndex={-3}
      >
        {formattedTimeLeft}
      </button>
      <span className="text-lg font-semibold text-text/70 whitespace-nowrap">
        {sessionType}
      </span>
    </div>
  );
};