// Credits - https://github.com/vydimitrov/use-elapsed-time

import React from "react";

type MayBe<T> = T | null;

export interface ReturnValue {
  /** Current elapsed time in seconds */
  elapsedTime: number;
  /** Reset method to reset the elapsed time and start over. startAt value can be changed by passing newStartAt */
  reset: (newStartAt?: number) => void;
}

export interface OnComplete {
  /** Indicates if the loop should start over. Default: false */
  shouldRepeat?: boolean;
  /** Delay in seconds before looping again. Default: 0 */
  delay?: number;
  /** Change the startAt value before looping again. Default: startAt value */
  newStartAt?: number;
}

export interface Props {
  /** Indicates if the loop to get the elapsed time is running or it is paused */
  isPlaying: boolean;
  /** Animation duration in seconds */
  duration?: number;
  /** Start the animation at provided time in seconds. Default: 0 */
  startAt?: number;
  /** Update interval in seconds. Determines how often the elapsed time value will change. When set to 0 the value will update on each key frame. Default: 0 */
  updateInterval?: number;
  /** On animation complete event handler. It can be used to restart/repeat the animation by returning an object */
  onComplete?: (totalElapsedTime: number) => OnComplete | void;
  /** On time update event handler. It receives the current elapsedTime time in seconds */
  onUpdate?: (elapsedTime: number) => void;
}

export const useElapsedTime = ({
  isPlaying,
  duration,
  startAt = 0,
  updateInterval = 0,
  onComplete,
  onUpdate,
}: Props): ReturnValue => {
  const [displayTime, setDisplayTime] = React.useState(startAt);
  const elapsedTimeRef = React.useRef(0);
  const startAtRef = React.useRef(startAt);
  const totalElapsedTimeRef = React.useRef(startAt * -1000); // keep in milliseconds to avoid summing up floating point numbers
  const requestRef = React.useRef<MayBe<number>>(null);
  const previousTimeRef = React.useRef<MayBe<number>>(null);
  const repeatTimeoutRef = React.useRef<MayBe<NodeJS.Timeout>>(null);
  const [bgInterval, setBgInterval] = React.useState<NodeJS.Timer>();
  const visibilityRef = React.useRef(true);
  const prevVisibilityRef = React.useRef(true);
  const tempTimerRef = React.useRef(0);
  const startedTimerRef = React.useRef(Date.now());
  const stoppedTimerRef = React.useRef(Date.now());

  const loop = (time: number) => {
    const timeSec = time / 1000;
    if (previousTimeRef.current === null) {
      previousTimeRef.current = timeSec;
      requestRef.current = requestAnimationFrame(loop);
      return;
    }

    // get current elapsed time
    const deltaTime = timeSec - previousTimeRef.current;
    let currentElapsedTime = elapsedTimeRef.current + deltaTime;

    // catch up with interval
    if (!prevVisibilityRef.current && visibilityRef.current) {
      currentElapsedTime = (Date.now() - startedTimerRef.current) / 1000;
    }

    // update refs with the current elapsed time
    previousTimeRef.current = timeSec;
    elapsedTimeRef.current = currentElapsedTime;

    // set current display time by adding the elapsed time on top of the startAt time
    const currentDisplayTime =
      startAtRef.current +
      (updateInterval === 0
        ? currentElapsedTime
        : ((currentElapsedTime / updateInterval) | 0) * updateInterval);

    const totalTime = startAtRef.current + currentElapsedTime;
    const isCompleted = typeof duration === "number" && totalTime >= duration;
    visibilityRef.current &&
      setDisplayTime(isCompleted ? duration! : currentDisplayTime);

    // repeat animation if not completed
    if (!isCompleted) {
      requestRef.current = requestAnimationFrame(loop);
    }
  };

  React.useEffect(() => {
    function checkTabFocused() {
      prevVisibilityRef.current = visibilityRef.current;
      visibilityRef.current = document.visibilityState === "visible";
    }

    visibilityRef.current = document.visibilityState === "visible";

    document.addEventListener("visibilitychange", checkTabFocused);
    return () =>
      document.removeEventListener("visibilitychange", checkTabFocused);
  }, []);

  const cleanup = () => {
    requestRef.current && cancelAnimationFrame(requestRef.current);
    repeatTimeoutRef.current && clearTimeout(repeatTimeoutRef.current);
    previousTimeRef.current = null;
    clearInterval(bgInterval);
    setBgInterval(undefined);
  };

  React.useEffect(() => {
    startedTimerRef.current =
      stoppedTimerRef.current +
      startedTimerRef.current -
      stoppedTimerRef.current;
  }, [duration]);

  const reset = React.useCallback(
    (newStartAt?: number) => {
      cleanup();

      elapsedTimeRef.current = 0;
      const nextStartAt = typeof newStartAt === "number" ? newStartAt : startAt;
      startAtRef.current = nextStartAt;
      setDisplayTime(nextStartAt);

      if (isPlaying) {
        requestRef.current = requestAnimationFrame(loop);
      }
    },
    [isPlaying, startAt]
  );

  React.useEffect(() => {
    onUpdate?.(displayTime);

    if (duration && displayTime >= duration) {
      totalElapsedTimeRef.current += duration * 1000;

      const {
        shouldRepeat = false,
        delay = 0,
        newStartAt,
      } = onComplete?.(totalElapsedTimeRef.current / 1000) || {};

      if (shouldRepeat) {
        repeatTimeoutRef.current = setTimeout(
          () => reset(newStartAt),
          delay * 1000
        );
      }
    }
  }, [displayTime, duration]);

  React.useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
      if (!duration) return;

      startedTimerRef.current =
        Date.now() + startedTimerRef.current - stoppedTimerRef.current;

      const bgTimer = setInterval(() => {
        tempTimerRef.current = Math.floor(
          (Date.now() - startedTimerRef.current) / 1000
        );
        !visibilityRef.current && setDisplayTime(tempTimerRef.current);
      }, 250);

      setBgInterval(bgTimer);
    } else {
      clearInterval(bgInterval);
      setBgInterval(undefined);
      stoppedTimerRef.current = Date.now();
    }

    return cleanup;
    // start animation over when duration or updateInterval change
  }, [isPlaying, updateInterval]);

  return { elapsedTime: displayTime, reset };
};
