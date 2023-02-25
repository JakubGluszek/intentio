import React from "react";
import { listen } from "@tauri-apps/api/event";

import { Settings } from "@/bindings/Settings";
import { Intent } from "@/bindings/Intent";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";
import { Session } from "@/bindings/Session";
import { Theme } from "@/bindings/Theme";
import { Task } from "@/bindings/Task";
import { Note } from "@/bindings/Note";
import { Script } from "@/bindings/Script";

type Events = {
  [key: string]: any;
  settings_updated: Settings;
  active_intent_id_updated: { active_intent_id: string | undefined };
  current_theme_updated: Theme;
  current_theme_changed: undefined;
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
  tasks_deleted: ModelDeleteResultData[];
  note_created: Note;
  note_updated: Note;
  note_deleted: ModelDeleteResultData;
  notes_deleted: ModelDeleteResultData[];
  script_created: Script;
  script_updated: Script;
  script_deleted: ModelDeleteResultData;
};

type Callback<T extends keyof Events> = (data: Events[T]) => void;

/**
Hook that registers event listeners and invokes the corresponding callbacks when events are triggered.
@param callbacks An object that maps event types to their corresponding callbacks.

Events can be emitted by both backend and client side.
*/
export default function useEvents<T extends keyof Events>(callbacks: {
  [K in T]?: Callback<K>;
}) {
  React.useEffect(() => {
    // Create an array of listener promises by mapping over the callbacks and registering a listener for each event type
    const listeners = Object.entries(callbacks).map(([eventType, callback]) => {
      return listen(eventType, (event) =>
        // Cast the callback to the appropriate type and invoke it with the event payload
        (callback as Callback<keyof Events>)(event.payload)
      );
    });
    // Return a cleanup function that removes all the registered listeners
    return () => {
      listeners.forEach((unlisten) => unlisten.then((f) => f()));
    };
  }, [callbacks]);
  return;
}