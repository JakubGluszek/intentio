import React from "react";
import { Event, listen } from "@tauri-apps/api/event";

import { Settings } from "@/bindings/Settings";
import { State } from "@/bindings/State";

type Events = {
  settings_updated: Settings;
  state_updated: State;
  current_theme_updated: undefined;
};

type Callback<T> = (data: Event<T>) => void;

export function useEvent<K extends keyof Events>(
  eventType: K,
  callback: Callback<Events[K]>
) {
  React.useEffect(() => {
    const unlisten = listen<Events[typeof eventType]>(eventType, (event) =>
      callback(event)
    );
    return () => unlisten.then((f) => f()) as never;
  }, []);

  return;
}
