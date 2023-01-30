import React from "react";
import { Event, listen } from "@tauri-apps/api/event";

import { Settings } from "@/bindings/Settings";
import { Intent } from "@/bindings/Intent";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";
import { Session } from "@/bindings/Session";
import { Theme } from "@/bindings/Theme";
import { Task } from "@/bindings/Task";

type Events = {
  settings_updated: Settings;
  active_intent_id_updated: { active_intent_id: string | undefined };
  current_theme_updated: Theme;
  intent_created: Intent;
  intent_updated: Intent;
  intent_deleted: ModelDeleteResultData;
  intent_archived: Intent;
  intent_unarchived: Intent;
  session_saved: Session;
  preview_theme: Theme;
  task_created: Task;
  task_updated: Task;
  task_deleted: ModelDeleteResultData;
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
  }, [callback]);

  return;
}
