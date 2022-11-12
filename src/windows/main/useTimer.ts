import React from "react";
import { sendNotification } from "@tauri-apps/api/notification";

import { ActiveQueue } from "../../bindings/ActiveQueue";
import { Queue } from "../../bindings/Queue";
import { Settings } from "../../bindings/Settings";
import { ipc_invoke } from "../../ipc";
import useGlobal from "../../store";

type TimerType = "focus" | "break" | "long break";

const useTimer = (settings: Settings, queue: ActiveQueue | null) => {
  // key is needed to reset timer components inner state
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
    if (!queueRef.current && queue) {
      setDuration(queue.sessions[queue.session_idx].duration);
      setCurrentProjectById(queue.sessions[queue.session_idx].project_id);
      setType("focus");
      setKey("focus");
    } else if (queueRef.current && !queue) {
      setCurrentProjectById(settings.current_project_id);
      setDuration(settings.pomodoro_duration);
      setType("focus");
      setKey("focus");
    } else if (queue && queue.id !== queueRef.current?.id) {
      setDuration(queue.sessions[queue.session_idx].duration);
      setCurrentProjectById(queue.sessions[queue.session_idx].project_id);
      setType("focus");
      setKey("focus");
    }
    queueRef.current = queue;
  }, [queue]);

  // Sync duration change on settings update
  React.useEffect(() => {
    switch (type) {
      case "focus":
        if (!queue) {
          setDuration(settings.pomodoro_duration);
          setKey("focus");
        }
        break;
      case "break":
        setDuration(settings.break_duration);
        setKey("break");
        break;
      case "long break":
        setDuration(settings.long_break_duration);
        setKey("long break");
        break;
    }
  }, [settings]);

  const start = () => {
    if (!startedAt) {
      setStartedAt(new Date());
    }
    setIsRunning(true);
  };

  const pause = () => {
    setIsRunning(false);
  };

  const onUpdate = () => setTimeFocused((seconds) => seconds + 1);

  /** Saves a focus session if it's at least 1 min long */
  const save = React.useCallback(() => {
    if (type !== "focus" || timeFocused < 60) return;

    ipc_invoke("create_session", {
      data: {
        duration: ~~((timeFocused + 1) / 60),
        started_at: startedAt && startedAt.getTime().toString(),
        project_id: currentProject?.id,
      },
    }).then(() => setIterations((it) => it + 1));
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
        setTimeFocused(0);
        setStartedAt(null);

        const is_long_break =
          iterations >= settings.long_break_interval &&
          iterations % settings.long_break_interval === 0;

        if (is_long_break) {
          switchSession("long break");

          if (!manual) {
            sendNotification({
              title: "Session",
              body: "Time for a long break!",
            });
          }
        } else {
          switchSession("break");

          if (!manual) {
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

        if (!manual) {
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
  };
};

export default useTimer;
