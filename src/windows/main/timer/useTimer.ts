import React from "react";
import toast from "react-hot-toast";
import { sendNotification } from "@tauri-apps/api/notification";

import { SessionQueue } from "../../../bindings/SessionQueue";
import { Settings } from "../../../bindings/Settings";
import { TimerType } from "../../../types";
import { invoke } from "@tauri-apps/api";
import { useStore } from "@/app/store";
import services from "@/app/services";

const useTimer = (settings: Settings, queue: SessionQueue | null) => {
  // custom key is needed to reset timer components inner state
  const [key, setKey] = React.useState("focus");
  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(
    queue
      ? queue.sessions[queue.session_idx].duration
      : settings.pomodoro_duration
  );
  const [startedAt, setStartedAt] = React.useState<Date>();
  const [timeFocused, setTimeFocused] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [iterations, setIterations] = React.useState(0);

  const state = useStore((state) => state.state);

  React.useEffect(() => {
    invoke("get_state");
    setDuration(settings.pomodoro_duration);
    setType("focus");
    setKey("focus");
  }, []);

  // Sync duration change on settings update
  React.useEffect(() => {
    switch (type) {
      case "focus":
        if (!queue) {
          setDuration(settings.pomodoro_duration);
        }
        break;
      case "break":
        setDuration(settings.break_duration);
        break;
      case "long break":
        setDuration(settings.long_break_duration);
        break;
    }
  }, [settings]);

  const restart = () => {
    pause();
    save();
    setTimeFocused(0);
    setStartedAt(undefined);

    switch (type) {
      case "focus":
        if (queue) {
          setDuration(queue.sessions[queue.session_idx].duration);
        } else {
          setDuration(settings.pomodoro_duration);
        }
        setKey("focus-restart");
        break;
      case "break":
        setDuration(settings.break_duration);
        setKey("break-restart");
        break;
      case "long break":
        setDuration(settings.long_break_duration);
        setKey("long break-restart");
        break;
    }
  };

  const start = React.useCallback(() => {
    if (!startedAt) {
      setStartedAt(new Date());
    }
    setIsRunning(true);

    switch (type) {
      case "focus":
        setKey("focus");
        break;
      case "break":
        setKey("break");
        break;
      case "long break":
        setKey("long break");
        break;
    }
  }, [startedAt, type]);

  const pause = () => {
    setIsRunning(false);
  };

  const onUpdate = () => setTimeFocused((focused) => focused + 1);

  /** Saves a focus session */
  const save = React.useCallback(() => {
    if (type !== "focus" || timeFocused < 60) return;

    services
      .createSession({
        duration: ~~((timeFocused + 1) / 60),
        started_at: startedAt!.getTime().toString(),
        intent_id: state?.active_intent?.id ?? null,
        paused_at: [],
        resumed_at: [],
      })
      .then(() => {
        setIterations((it) => it + 1);
        toast("Session saved", { position: "top-center" });
      });
  }, [type, state, timeFocused, startedAt]);

  const switchSession = React.useCallback(
    (type: TimerType) => {
      setTimeFocused(0);
      setStartedAt(undefined);

      switch (type) {
        case "focus":
          setDuration(settings.pomodoro_duration);
          setType("focus");
          setKey("focus");
          break;
        case "break":
          setDuration(settings.break_duration);
          setType("break");
          setKey("break");
          break;
        case "long break":
          setDuration(settings.long_break_duration);
          setType("long break");
          setKey("long break");
          break;
      }
    },
    [queue, settings]
  );

  // next session
  const next = React.useCallback(
    (manual = false) => {
      pause();

      if (type === "focus") {
        save();

        const is_long_break =
          iterations >= settings.long_break_interval &&
          iterations % settings.long_break_interval === 0;

        if (is_long_break) {
          switchSession("long break");

          if (!manual && settings.system_notifications) {
            sendNotification({
              title: "Session",
              body: "Time for a long break!",
            });
          }
        } else {
          switchSession("break");

          if (!manual && settings.system_notifications) {
            sendNotification({
              title: "Session",
              body: "Time for a break!",
            });
          }
        }

        if (!manual && settings.auto_start_breaks) {
          start();
        }
      } else {
        switchSession("focus");

        if (!manual && settings.system_notifications) {
          sendNotification({
            title: "Session",
            body: "Time to focus!",
          });
        }

        if (!manual && settings.auto_start_pomodoros) {
          start();
        }
      }
    },
    [type, settings, queue, iterations, timeFocused]
  );

  return {
    key,
    type,
    duration,
    isRunning,
    iterations,
    start,
    pause,
    next,
    onUpdate,
    restart,
  };
};

export default useTimer;
