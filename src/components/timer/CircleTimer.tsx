import React from "react";

type ColorHex = `#${string}`;
type ColorRGBA = `rgba(${string})`;
type ColorURL = `url(#${string})`;
type ColorRGB = `rgb(${string})`;
export type ColorFormat = ColorHex | ColorRGB | ColorRGBA | ColorURL;

export interface CircleTimerProps {
  children: React.ReactNode;
  isPlaying: boolean;
  duration: number;
  elapsedTime: number;
  strokeWidth: number;
  size: number;
  color: ColorFormat;
  trailColor: ColorFormat;
}

export const CircleTimer: React.FC<CircleTimerProps> = ({
  children,
  ...props
}) => {
  const { path, pathLength } = getPathProps(
    props.size,
    props.strokeWidth,
    "clockwise"
  );

  const stroke = getStroke(props.color, props.duration, props.elapsedTime);

  const strokeDashoffset = linearEase(
    props.elapsedTime,
    0,
    pathLength,
    props.duration
  );

  return (
    <div className="relative grow flex flex-col items-center justify-center bg-base/10 rounded-sm">
      <svg
        width={props.size}
        height={props.size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={path}
          stroke="rgba(var(--window-color) / 0.95)"
          strokeWidth={props.strokeWidth}
          fill="transparent"
        />

        <path
          d={path}
          fill="rgba(var(--primary-color) / 0.1)"
          stroke={stroke}
          strokeLinecap={"round"}
          strokeWidth={props.strokeWidth}
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div className="absolute left-0 top-0 w-full h-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
};

const linearEase = (
  time: number,
  start: number,
  goal: number,
  duration: number
) => {
  if (duration === 0) {
    return start;
  }

  const currentTime = time / duration;
  return start + goal * currentTime;
};

const getRGB = (color: string) =>
  color
    .replace(
      /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
      (_, r, g, b) => `#${r}${r}${g}${g}${b}${b}`
    )
    .substring(1)
    .match(/.{2}/g)
    ?.map((x) => parseInt(x, 16)) ?? [];

const getStroke = (
  color: ColorFormat,
  duration: number,
  elapsedTime: number
): ColorFormat => {
  if (typeof color === "string") {
    return color;
  }

  const currentTime = elapsedTime;
  const currentDuration = duration;
  const startColorRGB = getRGB(color);
  const endColorRGB = getRGB(color);

  return `rgb(${startColorRGB
    .map(
      (color, index) =>
        linearEase(
          currentTime,
          color,
          endColorRGB[index] - color,
          currentDuration
        ) | 0
    )
    .join(",")})`;
};

const getPathProps = (
  size: number,
  strokeWidth: number,
  rotation: "clockwise" | "counterclockwise"
) => {
  const halfSize = size / 2;
  const halfStrokeWith = strokeWidth / 2;
  const arcRadius = halfSize - halfStrokeWith;
  const arcDiameter = 2 * arcRadius;
  const rotationIndicator = rotation === "clockwise" ? "1,0" : "0,1";

  const pathLength = 2 * Math.PI * arcRadius;
  const path = `m ${halfSize},${halfStrokeWith} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,${arcDiameter} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,-${arcDiameter}`;

  return { path, pathLength };
};
