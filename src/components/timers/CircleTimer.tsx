import React from "react";

type ColorHex = `#${string}`;
type ColorRGBA = `rgba(${string})`;
type ColorURL = `url(#${string})`;
type ColorRGB = `rgb(${string})`;
export type ColorFormat = ColorHex | ColorRGB | ColorRGBA | ColorURL;

interface Props {
  children: React.ReactNode;
  isPlaying: boolean;
  duration: number;
  elapsedTime: number;
  strokeWidth: number;
  size: number;
  color: ColorFormat;
  trailColor: ColorFormat;
}

const CircleTimer: React.FC<Props> = ({ children, ...props }) => {
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
    <div className="relative grow flex flex-col items-center justify-center bg-window/90 border-2 border-base/80 rounded">
      <svg
        width={props.size}
        height={props.size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d={path}
          stroke={props.trailColor}
          strokeWidth={props.strokeWidth}
          fill="transparent"
        />
        <path
          style={{ opacity: 0.2 }}
          d={path}
          stroke={"#000"}
          strokeWidth={props.strokeWidth}
          fill="transparent"
        />

        <path
          d={path}
          fill="transparent"
          stroke={stroke}
          strokeLinecap={"round"}
          strokeWidth={props.strokeWidth}
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
      <div style={timeStyle}>{children}</div>
    </div>
  );
};

CircleTimer.displayName = "CircleTimer";

export const linearEase = (
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

export const getStroke = (
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

export const getPathProps = (
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

export const getStartAt = (duration: number, initialRemainingTime?: number) => {
  if (duration === 0 || duration === initialRemainingTime) {
    return 0;
  }

  return typeof initialRemainingTime === "number"
    ? duration - initialRemainingTime
    : 0;
};

export const getWrapperStyle = (size: number): React.CSSProperties => ({
  position: "relative",
  width: size,
  height: size,
});

export const timeStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

export const getIsColorBetweenColors = (
  color: ColorRGB,
  start: ColorRGB,
  end: ColorRGB
) => {
  const getIsInRange = (x: number, min: number, max: number) =>
    (x - min) * (x - max) <= 0;

  const getRGB = (color: ColorRGB): number[] =>
    color
      .match(/(\d+),(\d+),(\d+)/)!
      .splice(1, 4)
      .map((c: string) => parseInt(c, 10));

  const colorRGB = getRGB(color);
  const startRGB = getRGB(start);
  const endRGB = getRGB(end);

  return colorRGB.every((c, index) =>
    getIsInRange(c, startRGB[index], endRGB[index])
  );
};

export default CircleTimer;
