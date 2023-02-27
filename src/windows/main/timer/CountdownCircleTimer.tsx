// Credits - https://github.com/vydimitrov/react-countdown-circle-timer

import React from "react";

import { TimerProps } from "./types";
import { getWrapperStyle, timeStyle } from "./utils";
import { useCountdown } from "./useCountdown";

const CountdownCircleTimer: React.FC<TimerProps & { display: boolean }> = (
  props
) => {
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
    <div className="grow flex flex-col" style={getWrapperStyle(size)}>
      <div className="absolute bg-transparent overflow-clip">
        <svg
          width={size}
          height={size}
          style={{
            borderRadius: 150,
            boxShadow: "0 20px 0 80px rgb(var(--window-color))",
          }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={path} fill="transparent"/>
          <path
            className="transition-colors duration-300"
            d={path}
            fill="transparent"
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
    </div>
  );
};

CountdownCircleTimer.displayName = "CountdownCircleTimer";

export { CountdownCircleTimer, useCountdown };
