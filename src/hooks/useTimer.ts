import { useElapsedTime } from "./useElapsedTime";

export type SessionType = "focus" | "break" | "long break";

export interface TimerState {
  type: SessionType;
  duration: number; // seconds;
  elapsedTime: number; // seconds
  iterations: number;
  isPlaying: boolean;
  startedAt?: string; // epoch in ms
  intentId?: string;
}

export interface useTimerProps {
  state: TimerState;
  onStateChange: (state: TimerState) => void;
  config: {
    focusDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    longBreakInterval: number;
    autoStartFocus: boolean;
    autoStartBreak: boolean;
  };
  onUpdated?: (timeLeft: number) => void;
  onPaused?: () => void;
  onResumed?: () => void;
  onSessionSwitched?: (type: SessionType) => void;
  onSkipped?: () => void;
  onRestarted?: () => void;
  onCompleted?: (state: TimerState) => void;
}

export interface Timer {
  state: TimerState;
  resume: () => void;
  pause: () => void;
  restart: () => void;
  skip: () => void;
  /** Floating point number for smooth stroke render */
  elapsedTimeDetailed: number;
}

export const useTimer = (props: useTimerProps): Timer => {
  const { reset, elapsedTime } = useElapsedTime({
    isPlaying: props.state.isPlaying,
    duration: props.state.duration,
    updateInterval: 0,
    onUpdate: onUpdate,
    onComplete: complete,
  });

  function onUpdate(elapsedTime: number) {
    props.onStateChange({ ...props.state, elapsedTime });
    if (elapsedTime === props.state.duration) {
      skip();
    }
  }

  function resume() {
    let state = {
      ...props.state,
      isPlaying: true,
    };

    if (props.state.startedAt === undefined) {
      state = {
        ...state,
        startedAt: new Date().getTime().toString(),
      };
    }

    props.onStateChange(state);
  }

  function pause() {
    props.onStateChange({ ...props.state, isPlaying: false });
    props.onPaused && props.onPaused();
  }

  function restart() {
    reset();
    props.onStateChange({
      ...props.state,
      startedAt: undefined,
      elapsedTime: 0,
      isPlaying: false,
    });
    props.onRestarted && props.onRestarted();
  }

  function switchSession(prevType: SessionType) {
    let state = {
      ...props.state,
      isPlaying: false,
      elapsedTime: 0,
      startedAt: undefined,
    };

    if (prevType === "focus") {
      const isLongBreak =
        props.state.iterations >= props.config.longBreakInterval &&
        props.state.iterations % props.config.longBreakInterval === 0;

      if (prevType === "focus" && isLongBreak) {
        state = {
          ...state,
          type: "long break",
          duration: props.config.longBreakDuration,
        };
      } else if (prevType === "focus") {
        state = {
          ...state,
          type: "break",
          duration: props.config.breakDuration,
        };
      }
    } else {
      state = { ...state, type: "focus", duration: props.config.focusDuration };
    }

    props.onStateChange(state);

    if (state.type === "focus" && props.config.autoStartFocus) resume();
    else if (props.config.autoStartBreak) resume();
  }

  function skip() {
    complete();
    switchSession(props.state.type);
    reset();
  }

  function complete() {
    props.onCompleted && props.onCompleted(props.state);
  }

  return {
    state: props.state,
    elapsedTimeDetailed: elapsedTime,
    resume,
    pause,
    restart,
    skip,
  };
};
