import React from "react";
import { sendNotification } from "@tauri-apps/api/notification";

import { useTimer, useTimerReturnValues } from "@/components";
import ipc from "@/ipc";
import useStore from "@/store";
import utils from "@/utils";
import { useEvents } from "@/hooks";
import { appWindow } from "@tauri-apps/api/window";
import { SessionForCreate } from "@/bindings/SessionForCreate";
import { toast } from "react-hot-toast";

export interface TimerContextReturnValues extends useTimerReturnValues {
  displayCountdown: boolean;
  toggleDisplayCountdown: () => void;
  sessionForCreate: SessionForCreate | null;
  clearSessionForCreate: () => void;
}

export const TimerContext =
  React.createContext<TimerContextReturnValues | null>(null);

interface TimerContextProviderProps {
  children: React.ReactNode;
}

export const TimerContextProvider: React.FC<TimerContextProviderProps> = ({
  children,
}) => {
  const [displayCountdown, setDisplayCountdown] = React.useState(true);
  const [sessionForCreate, setSessionForCreate] =
    React.useState<SessionForCreate | null>(null);

  const toggleDisplayCountdown = () => setDisplayCountdown((prev) => !prev);

  const store = useStore();
  const settings = store.settingsConfig!;

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
        if (timer.config.session_summary) {
          setSessionForCreate({
            duration: ~~(session.elapsedTime! / 60),
            started_at: session.startedAt,
            summary: null,
            intent_id: store.currentIntent?.id ?? null,
          });
        } else {
          ipc
            .createSession({
              duration: ~~(session.elapsedTime! / 60),
              started_at: session.startedAt,
              summary: null,
              intent_id: store.currentIntent?.id!,
            })
            .then(() => toast("Session saved"));
        }
      }
    },
    onCompleted: (session) => {
      if (settings.main_display_on_timer_complete) {
        appWindow.isVisible().then((visible) => {
          if (!visible) {
            appWindow.show();
          }
        });
      }

      ipc.playAudio();

      store.scripts.forEach(
        (script) =>
          script.active &&
          (session.type === "Focus"
            ? script.run_on_session_end
            : script.run_on_break_end) &&
          utils.executeScript(script.body)
      );

      if (!store.settingsConfig?.system_notifications) return;

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

      if (!store.settingsConfig?.system_notifications || document.hasFocus())
        return;

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

      if (!store.settingsConfig?.system_notifications) return;
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
  }, []);

  useEvents({
    script_updated: (data) => store.patchScript(data.id, data),
    timer_play: () => (timer.isPlaying ? timer.pause() : timer.resume()),
    timer_skip: () => timer.skip(),
  });

  return (
    <TimerContext.Provider
      value={{
        ...timer,
        displayCountdown,
        toggleDisplayCountdown,
        sessionForCreate,
        clearSessionForCreate: () => setSessionForCreate(null),
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};
