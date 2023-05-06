import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendNotification } from "@tauri-apps/api/notification";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import { MainWindowContext } from "@/contexts";
import { Pane } from "@/ui";
import ipc from "@/ipc";
import { useEvents } from "@/hooks";
import utils from "@/utils";
import { Timer, TimerIntent, useTimer } from "@/components";

const TimerPane: React.FC = () => {
  const { display } = React.useContext(MainWindowContext)!;
  const store = useStore();

  const timer = useTimer(store.timerConfig, {
    onStateUpdate: (state) =>
      ipc.updateTimerState({
        session_type: state.type,
        is_playing: state.isPlaying,
      }),
    onSaveSession: (session) => {
      if (
        session.type === "Focus" &&
        session.elapsedTime &&
        session.elapsedTime >= 60 &&
        session.startedAt
      ) {
        ipc
          .createSession({
            duration: ~~(session.elapsedTime! / 60),
            started_at: session.startedAt,
            intent_id: store.currentIntent?.id!,
          })
          .then(() => toast("Session saved"));
      }
    },
    onCompleted: (session) => {
      ipc.playAudio();

      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_end
            : script.run_on_break_end) &&
          utils.executeScript(script.body)
      );

      if (!store.behaviorConfig?.system_notifications) return;

      switch (session.type) {
        case "Focus":
          sendNotification(
            `Focus session has completed.\n${store.timerConfig?.auto_start_breaks ? "Starting a break!" : ""
            }`
          );
          break;
        case "Break":
          sendNotification(
            `Break has completed.\n${store.timerConfig?.auto_start_focus
              ? "Starting a focus session!"
              : ""
            }`
          );
          break;
        case "LongBreak":
          sendNotification(
            `Long break has completed.\n${store.timerConfig?.auto_start_focus
              ? "Starting a focus session!"
              : ""
            }`
          );
          break;
      }
    },
    onResumed: (session) => {
      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_start
            : script.run_on_break_start) &&
          utils.executeScript(script.body)
      );

      if (!store.behaviorConfig?.system_notifications) return;
      if (document.hasFocus()) return;

      switch (session.type) {
        case "Focus":
          sendNotification("Focus session has been resumed.");
          break;
        case "Break":
          sendNotification("Break has been resumed.");
          break;
        case "LongBreak":
          sendNotification("Long break has been resumed.");
          break;
      }
    },
    onPaused: (session) => {
      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_pause
            : script.run_on_break_pause) &&
          utils.executeScript(script.body)
      );

      if (!store.behaviorConfig?.system_notifications) return;
      if (document.hasFocus()) return;

      switch (session.type) {
        case "Focus":
          sendNotification("Focus session has been paused.");
          break;
        case "Break":
          sendNotification("Break has been paused.");
          break;
        case "LongBreak":
          sendNotification("Long break has been paused.");
          break;
      }
    },
  });

  React.useEffect(() => {
    ipc.getTimerConfig().then((data) => store.setTimerConfig(data));
    ipc.getScripts().then((data) => store.setScripts(data));
    ipc.getBehaviorConfig().then((data) => store.setBehaviorConfig(data));
  }, []);

  useEvents({
    script_updated: (data) => store.patchScript(data.id, data),
    timer_play: () => (timer.isPlaying ? timer.pause() : timer.resume()),
    timer_skip: () => timer.skip(),
  });

  if (!store.currentTheme) return null;

  return (
    <AnimatePresence initial={false} mode="popLayout">
      {display === "timer" && (
        <motion.div
          className="grow flex flex-col gap-0.5"
          transition={{ duration: 0.3, ease: "linear" }}
          initial={{ translateX: 300, opacity: 0.6 }}
          animate={{ translateX: 0, opacity: 1 }}
          exit={{ translateX: 300, opacity: 0.3 }}
        >
          <Pane className="grow flex flex-col" padding="lg">
            <div className="grow flex flex-col gap-0.5 rounded overflow-hidden">
              <Timer
                theme={store.currentTheme!}
                hideCountdown={
                  store.interfaceConfig?.display_timer_countdown ?? false
                }
                {...timer}
              />
              <TimerIntent data={store.currentIntent} />
            </div>
          </Pane>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TimerPane;
