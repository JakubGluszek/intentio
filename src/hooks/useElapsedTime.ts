import React from "react";

type MayBe<T> = T | null;

export interface ReturnValue {
  reset: (newStartAt?: number) => void;
  elapsedTime: number;
}

export interface Props {
  /** Indicates if the loop to get the elapsed time is running or it is paused */
  isPlaying: boolean;
  /** Animation duration in seconds */
  duration?: number;
  /** On animation complete event handler. It can be used to restart/repeat the animation by returning an object */
  onComplete?: (totalElapsedTime: number) => void;
  /** On time update event handler. It receives the current elapsedTime time in seconds */
  onUpdate?: (elapsedTime: number) => void;
}

export const useElapsedTime = ({
  isPlaying,
  duration,
  onComplete,
  onUpdate,
}: Props): ReturnValue => {
  const [elapsedTime, setElapsedTime] = React.useState(0);
  const [windowActive, setWindowActive] = React.useState(true);

  const [bgInterval, setBgInterval] = React.useState<NodeJS.Timer>();

  const elapsedTimeRef = React.useRef(0);
  const startAtRef = React.useRef(0);
  const totalElapsedTimeRef = React.useRef(0); // keep in milliseconds to avoid summing up floating point numbers
  const requestRef = React.useRef<MayBe<number>>(null);
  const previousTimeRef = React.useRef<MayBe<number>>(null);
  const tempTimerRef = React.useRef(0);
  const startedTimerRef = React.useRef(Date.now());
  const stoppedTimerRef = React.useRef(Date.now());
  const windowActiveRef = React.useRef(windowActive);
  const isPlayingRef = React.useRef(isPlaying);

  isPlayingRef.current = isPlaying;
  windowActiveRef.current = windowActive;

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

    // update refs with the current elapsed time
    previousTimeRef.current = timeSec;
    elapsedTimeRef.current = currentElapsedTime;

    // set current display time by adding the elapsed time on top of the startAt time
    const currentDisplayTime = startAtRef.current + currentElapsedTime;

    const totalTime = startAtRef.current + currentElapsedTime;
    const isCompleted = typeof duration === "number" && totalTime >= duration;

    setElapsedTime(isCompleted ? duration : currentDisplayTime);

    // repeat animation if not completed
    if (!isCompleted) {
      requestRef.current = requestAnimationFrame(loop);
    }
  };

  React.useEffect(() => {
    const handleVisibilityChange = () => setWindowActive((prev) => !prev);

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  const cleanup = React.useCallback(() => {
    requestRef.current && cancelAnimationFrame(requestRef.current);
    previousTimeRef.current = null;
    stoppedTimerRef.current = Date.now();

    clearInterval(bgInterval);
    setBgInterval(undefined);
  }, [bgInterval]);

  React.useEffect(() => {
    startedTimerRef.current =
      stoppedTimerRef.current +
      startedTimerRef.current -
      stoppedTimerRef.current;
  }, [duration]);

  const reset = React.useCallback(() => {
    cleanup();

    setElapsedTime(0);

    elapsedTimeRef.current = 0;
    startAtRef.current = 0;

    startedTimerRef.current = Date.now();
    stoppedTimerRef.current = Date.now();

    if (isPlaying) {
      requestRef.current = requestAnimationFrame(loop);
    }
  }, [isPlaying]);

  React.useEffect(() => {
    onUpdate?.(elapsedTime);

    if (duration && elapsedTime >= duration) {
      totalElapsedTimeRef.current += duration * 1000;

      onComplete?.(Math.ceil(totalElapsedTimeRef.current / 1000));
    }
  }, [elapsedTime, duration]);

  React.useEffect(() => {
    if (!isPlaying) {
      cleanup();
      return;
    }

    requestRef.current = requestAnimationFrame(loop);

    startedTimerRef.current =
      Date.now() + startedTimerRef.current - stoppedTimerRef.current;

    setBgInterval((prev) => {
      clearInterval(prev);

      return setInterval(() => {
        if (!isPlayingRef.current || windowActiveRef.current) return;
        // calculates duration
        tempTimerRef.current = Math.floor(
          (Date.now() - startedTimerRef.current) / 1000
        );
        // based on visibility state, applies that duration
        elapsedTimeRef.current = tempTimerRef.current;
        setElapsedTime(tempTimerRef.current);
      }, 250);
    });

    return cleanup;
  }, [isPlaying]);

  return { elapsedTime, reset };
};
