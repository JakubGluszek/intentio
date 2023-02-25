// Credits - https://github.com/vydimitrov/react-countdown-circle-timer

import React from "react";

import { TimerProps } from "./types";
import { getWrapperStyle, timeStyle } from "./utils";
import { useCountdown } from "./useCountdown";

const CountdownCircleTimer: React.FC<TimerProps> = (props) => {
  const { children, strokeLinecap, trailColor, trailStrokeWidth } = props;
  const {
    path,
    pathLength,
    strokeDashoffset,
    remainingTime,
    elapsedTime,
    stroke,
    size,
    strokeWidth,
  } = useCountdown(props);

  return (
    <div style={getWrapperStyle(size)}>
      <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <path
          d={path}
          fill="none"
          stroke={trailColor ?? "#d9d9d9"}
          strokeWidth={trailStrokeWidth ?? strokeWidth}
        />
        <path
          d={path}
          fill="none"
          stroke={stroke}
          strokeLinecap={strokeLinecap ?? "round"}
          strokeWidth={strokeWidth}
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      {typeof children === "function" && (
        <div style={timeStyle}>
          {children({ remainingTime, elapsedTime, color: stroke })}
        </div>
      )}
    </div>
  );
};

CountdownCircleTimer.displayName = "CountdownCircleTimer";

export { CountdownCircleTimer, useCountdown };
