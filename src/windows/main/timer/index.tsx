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

  const toggleDisplayCountdown = () =>
    ipc.updateInterfaceConfig({
      display_timer_countdown: !store.interfaceConfig?.display_timer_countdown,
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

  const formattedTimeLeft = utils.formatTimer(
    timer.duration - timer.elapsedTime
  );

  const sessionType =
    timer.type === "Focus"
      ? "Focus"
      : timer.type === "Break"
        ? "Break"
        : "Long break";

  if (!store.currentTheme) return null;

  return (
    <AnimatePresence initial={false}>
      {display === "timer" && (
        <motion.div
          className="grow flex flex-col gap-0.5"
          transition={{ duration: 0.3 }}
          initial={{ width: "0%", opacity: 0, translateX: 128 }}
          animate={{ width: "100%", opacity: 1, translateX: 0 }}
          exit={{ width: "0%", opacity: 0, translateX: 128 }}
        >
          <Pane className="grow flex flex-col">
            <CircleTimer
              isPlaying={timer.isPlaying}
              duration={timer.duration}
              elapsedTime={timer.elapsedTimeDetailed}
              strokeWidth={6}
              size={210}
              color={
                Color(
                  timer.isPlaying
                    ? store.currentTheme.primary_hex
                    : store.currentTheme.base_hex
                )
                  .alpha(0.8)
                  .hex() as ColorFormat
              }
              trailColor={
                Color(store.currentTheme.window_hex).hex() as ColorFormat
              }
            >
              <div className="flex flex-col items-center gap-1">
                {store.interfaceConfig?.display_timer_countdown ? (
                  <div className="mt-12 flex flex-col items-center">
                    <button
                      className="font-mono text-text/80 hover:text-text transition-colors duration-150"
                      onClick={() => toggleDisplayCountdown()}
                      style={{
                        fontSize: 40,
                      }}
                      tabIndex={-3}
                    >
                      {formattedTimeLeft}
                    </button>
                    <span className="text-lg font-semibold text-text/70 whitespace-nowrap">
                      {sessionType}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleDisplayCountdown()}
                    className="mt-8 text-4xl font-bold whitespace-nowrap text-text/80 hover:text-text transition-colors duration-150"
                    tabIndex={-3}
                  >
                    {sessionType}
                  </button>
                )}

                <div className="w-full flex flex-col items-center gap-1 transition-opacity duration-300">
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
              </div>
            </CircleTimer>
          </Pane>

          <Pane className="flex flex-row justify-between items-center">
            <div className="text-base/80 font-bold text-center p-1">
              #{timer.iterations}
            </div>
            {store.currentIntent && (
              <motion.div
                className="w-full flex flex-row items-center justify-center gap-1 text-text/80 text-medium p-1"
                transition={{ delay: 0.2, duration: 0.2 }}
                initial={{ opacity: 0, display: "none" }}
                animate={{ opacity: 1, display: "flex" }}
              >
                <span>{store.currentIntent.label}</span>
              </motion.div>
            )}
            <div className="w-8"></div>
          </Pane>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Timer;
