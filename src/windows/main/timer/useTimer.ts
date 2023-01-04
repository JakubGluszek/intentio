import React from "react";
import { sendNotification } from "@tauri-apps/api/notification";
import toast from "react-hot-toast";

import { Settings } from "@/bindings/Settings";
import { TimerType } from "@/types";
import services from "@/app/services";
import { useStore } from "@/app/store";

const useTimer = (settings: Settings) => {
  // custom key is needed to reset timer components inner state
  const [key, setKey] = React.useState("focus");
  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(settings.pomodoro_duration);
  const [startedAt, setStartedAt] = React.useState<Date>();
  const [timeFocused, setTimeFocused] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [iterations, setIterations] = React.useState(0);

  const store = useStore();

  React.useEffect(() => {
    setDuration(settings.pomodoro_duration);
    setType("focus");
    setKey("focus");
  }, []);

  // Sync duration change on settings update
  React.useEffect(() => {
    switch (type) {
      case "focus":
        setDuration(settings.pomodoro_duration);
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
        setDuration(settings.pomodoro_duration);
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
        intent_id: store.activeIntentId ?? null,
        timestamps: [], // TODO: Track paused_at & resumed_at timestamps
      })
      .then(() => {
        setIterations((it) => it + 1);
        toast("Session saved");
      });
  }, [type, store.activeIntentId, timeFocused, startedAt]);

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
    [settings]
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
    [type, settings, iterations, timeFocused]
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
