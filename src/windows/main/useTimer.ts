import React from "react";
import toast from "react-hot-toast";
import { sendNotification } from "@tauri-apps/api/notification";

import { ActiveQueue } from "../../bindings/ActiveQueue";
import { Queue } from "../../bindings/Queue";
import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../app/ipc";
import useGlobal from "../../app/store";
import { TimerType } from "../../types";
import { MIN_SESSION_DURATION } from "../../app/config";

const useTimer = (settings: Settings, queue: ActiveQueue | null) => {
  // custom key is needed to reset timer components inner state
  const [key, setKey] = React.useState("focus");
  const [type, setType] = React.useState<TimerType>("focus");
  const [duration, setDuration] = React.useState(
    queue
      ? queue.sessions[queue.session_idx].duration
      : settings.pomodoro_duration
  );
  const [startedAt, setStartedAt] = React.useState<Date | null>(null);
  const [timeFocused, setTimeFocused] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);
  const [iterations, setIterations] = React.useState(0);

  const currentProject = useGlobal((state) => state.currentProject);

  const setCurrentProjectById = useGlobal(
    (state) => state.setCurrentProjectById
  );
  const getTotalQueueCycles = useGlobal((state) => state.getTotalQueueCycles);

  const queueRef = React.useRef<Queue | null>(null);

  React.useEffect(() => {
    // set session for a new qeueue
    if (!queueRef.current && queue) {
      setDuration(queue.sessions[queue.session_idx].duration);
      setCurrentProjectById(queue.sessions[queue.session_idx].project_id);
      setType("focus");
      setKey("focus-queue");
      // unset queue, set session from settings
    } else if (queueRef.current && !queue) {
      setCurrentProjectById(settings.current_project_id);
      setDuration(settings.pomodoro_duration);
      setType("focus");
      setKey("focus");
      // set a different queue
    } else if (queue && queue.id !== queueRef.current?.id) {
      setDuration(queue.sessions[queue.session_idx].duration);
      setCurrentProjectById(queue.sessions[queue.session_idx].project_id);
      setType("focus");
      setKey("focus-queue-other");
    }
    queueRef.current = queue;
  }, [queue]);

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
    setStartedAt(null);

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
  }, [startedAt]);

  const pause = () => {
    setIsRunning(false);
  };

  const onUpdate = React.useCallback(
    () => type === "focus" && setTimeFocused((seconds) => seconds + 1),
    [type]
  );

  /** Saves a focus session */
  const save = React.useCallback(() => {
    if (type !== "focus" || timeFocused < MIN_SESSION_DURATION * 60) return;

    ipc_invoke("create_session", {
      data: {
        duration: ~~((timeFocused + 1) / 60),
        started_at: startedAt && startedAt.getTime().toString(),
        project_id: currentProject?.id,
      },
    }).then(() => {
      setIterations((it) => it + 1);
      toast("Session saved", { position: "top-center" });
    });
  }, [timeFocused]);

  const nextQueueSession = React.useCallback(() => {
    if (!queue) return;

    // if queue is finished, deactivate it
    if (queue.iterations >= getTotalQueueCycles()!) {
      ipc_invoke("deactivate_queue");
      return;
    }

    let session_idx = queue.session_idx;
    let session_cycle = queue.session_cycle + 1;
    if (queue.session_cycle === queue.sessions[session_idx].cycles) {
      session_idx += 1;
      session_cycle = 0;
    }

    setCurrentProjectById(queue.sessions[session_idx].project_id);
    setDuration(queue.sessions[session_idx].duration);

    ipc_invoke("set_active_queue", {
      data: {
        ...queue,
        iterations: queue.iterations + 1,
        session_idx,
        session_cycle,
      },
    }).catch((err) => console.log(err));
  }, [queue]);

  const switchSession = React.useCallback(
    (type: TimerType) => {
      setTimeFocused(0);
      setStartedAt(null);

      switch (type) {
        case "focus":
          if (queue) {
            nextQueueSession();
          } else {
            setDuration(settings.pomodoro_duration);
          }
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

  const next = React.useCallback(
    (manual: boolean = false) => {
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
          setTimeout(() => {
            start();
          }, 1000);
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
          setTimeout(() => {
            start();
          }, 1000);
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
