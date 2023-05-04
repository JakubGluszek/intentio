import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sendNotification } from "@tauri-apps/api/notification";
import { toast } from "react-hot-toast";
import { VscDebugRestart } from "react-icons/vsc";
import { MdPauseCircle, MdPlayCircle, MdSkipNext } from "react-icons/md";
import Color from "color";

import useStore from "@/store";
import { MainWindowContext } from "@/contexts";
import { Button, CircleTimer, ColorFormat, Pane } from "@/ui";
import ipc from "@/ipc";
import { useEvents } from "@/hooks";
import utils from "@/utils";
import { useTimer } from "./useTimer";
import { TimerDetails } from "./TimerDetails";

const Timer: React.FC = () => {
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
          initial={{ translateX: 300 }}
          animate={{ translateX: 0 }}
          exit={{ translateX: 300 }}
        >
          <Pane className="group relative grow flex flex-col">
            <CircleTimer
              isPlaying={timer.isPlaying}
              duration={timer.duration}
              elapsedTime={timer.elapsedTimeDetailed}
              strokeWidth={4}
              size={210}
              color={
                Color(
                  timer.isPlaying
                    ? store.currentTheme.base_hex
                    : store.currentTheme.base_hex
                )
                  .alpha(0.6)
                  .hex() as ColorFormat
              }
              trailColor={
                Color(store.currentTheme.window_hex).hex() as ColorFormat
              }
            >
              <div className="absolute m-auto">
                <TimerDetails
                  config={{
                    display: true,
                    hideCountdown:
                      store.interfaceConfig?.display_timer_countdown ?? false,
                  }}
                  onHideCountdownChange={() => {
                    ipc.updateInterfaceConfig({
                      display_timer_countdown:
                        !store.interfaceConfig?.display_timer_countdown,
                    });
                  }}
                  {...timer}
                />
              </div>

              <div className="absolute m-auto translate-y-[4.5rem] opacity-0 group-hover:opacity-100 w-full flex flex-col items-center gap-1 transition-opacity duration-150">
                <div className="group flex flex-row items-center justify-center">
                  <button
                    tabIndex={-3}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-base/80 hover:text-primary"
                    onClick={() => timer.restart()}
                  >
                    <VscDebugRestart size={21} />
                  </button>

                  <Button
                    variant="ghost"
                    onClick={() =>
                      timer.isPlaying ? timer.pause() : timer.resume()
                    }
                    config={{ ghost: { highlight: false } }}
                  >
                    {timer.isPlaying ? (
                      <MdPauseCircle size={36} />
                    ) : (
                      <MdPlayCircle size={36} />
                    )}
                  </Button>
                  <button
                    tabIndex={-3}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-base/80 hover:text-primary -translate-x-0.5"
                    onClick={() => {
                      timer.skip(true);
                    }}
                  >
                    <MdSkipNext size={26} />
                  </button>
                </div>
              </div>
            </CircleTimer>

            <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-base/80 font-bold text-center p-1">
              #{timer.iterations}
            </div>
          </Pane>

          {store.currentIntent && (
            <Pane className="flex flex-row justify-between items-center">
              <div className="w-full flex flex-row items-center justify-center gap-1 text-text/80 text-medium p-1">
                <span>{store.currentIntent.label}</span>
              </div>
            </Pane>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Timer;
