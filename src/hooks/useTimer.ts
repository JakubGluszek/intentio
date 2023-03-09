import { SessionType } from "@/bindings/SessionType";
import { TimerConfig } from "@/bindings/TimerConfig";
import { TimerSession } from "@/bindings/TimerSession";
import ipc from "@/ipc";
import { useElapsedTime } from "./useElapsedTime";

export interface useTimerProps {
  session: TimerSession;
  onSessionUpdate: (session: TimerSession) => void;
  config: TimerConfig;
  onUpdated?: (timeLeft: number) => void;
  onPaused?: () => void;
  onResumed?: () => void;
  onSessionSwitched?: (type: SessionType) => void;
  onSkipped?: () => void;
  onRestarted?: () => void;
  onCompleted?: (session: TimerSession) => void;
}

export interface Timer {
  session: TimerSession;
  resume: () => void;
  pause: () => void;
  restart: () => void;
  skip: () => void;
  /** Floating point number for smooth stroke render */
  elapsedTimeDetailed: number;
}

export const useTimer = (props: useTimerProps): Timer => {
  const { reset, elapsedTime } = useElapsedTime({
    isPlaying: props.session.is_playing,
    duration: props.session.duration,
    updateInterval: 0,
    onUpdate: onUpdate,
    onComplete: complete,
  });

  function onUpdate(elapsedTime: number) {
    props.onSessionUpdate({ ...props.session, elapsed_time: elapsedTime });
    if (elapsedTime === props.session.duration) {
      skip();
    }
  }

  function resume() {
    let session = {
      ...props.session,
      is_playing: true,
    };

    if (props.session.started_at === null) {
      session = {
        ...session,
        started_at: new Date().getTime().toString(),
      };
    }

    props.onSessionUpdate(session);
  }

  function pause() {
    props.onSessionUpdate({ ...props.session, is_playing: false });
    props.onPaused && props.onPaused();
  }

  function restart() {
    complete();
    reset();
    props.onSessionUpdate({
      ...props.session,
      started_at: null,
      elapsed_time: 0,
      is_playing: false,
    });
    props.onRestarted && props.onRestarted();
  }

  function switchSession(prevType: SessionType) {
    let session = {
      ...props.session,
      is_playing: false,
      elapsed_time: 0,
      started_at: null,
    };

    if (prevType === "Focus") {
      const isLongBreak =
        props.session.iterations >= props.config.long_break_interval &&
        props.session.iterations % props.config.long_break_interval === 0;

      if (prevType === "Focus" && isLongBreak) {
        session = {
          ...session,
          _type: "LongBreak",
          duration: props.config.long_break_duration * 60,
        };
      } else if (prevType === "Focus") {
        session = {
          ...session,
          _type: "Break",
          duration: props.config.break_duration * 60,
        };
      }
    } else {
      session = {
        ...session,
        _type: "Focus",
        duration: props.config.focus_duration * 60,
      };
    }

    props.onSessionUpdate(session);

    if (session._type === "Focus" && props.config.auto_start_focus) resume();
    else if (props.config.auto_start_breaks) resume();
  }

  function skip() {
    complete();
    reset();
    switchSession(props.session._type);
  }

  function complete() {
    if (
      props.session._type !== "Focus" ||
      props.session.elapsed_time < 60 ||
      !props.session.started_at
    )
      return;

    ipc.createSession({
      duration: ~~(props.session.elapsed_time / 60),
      started_at: props.session.started_at,
      intent_id: props.session.intent_id,
    });

    props.onCompleted && props.onCompleted(props.session);
  }

  return {
    session: props.session,
    elapsedTimeDetailed: elapsedTime,
    resume,
    pause,
    restart,
    skip,
  };
};
