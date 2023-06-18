import React from "react";
import { listen } from "@tauri-apps/api/event";

import { Theme } from "@/bindings/Theme";
import { TimerConfig } from "@/bindings/TimerConfig";
import { SettingsConfig } from "@/bindings/SettingsConfig";
import { EventPayload } from "@/bindings/EventPayload";
import { TimerSession } from "@/bindings/TimerSession";
import { Queue } from "@/bindings/Queue";

type Id = number;

type Events = {
  [key: string]: any;
  intent_created: EventPayload<Id>;
  intent_updated: EventPayload<Id>;
  intent_deleted: EventPayload<Id>;
  intent_archived: EventPayload<Id>;
  intent_unarchived: EventPayload<Id>;

  task_created: EventPayload<Id>;
  task_updated: EventPayload<Id>;
  task_deleted: EventPayload<Id>;

  script_created: EventPayload<Id>;
  script_updated: EventPayload<Id>;
  script_deleted: EventPayload<Id>;

  theme_created: EventPayload<Id>;
  theme_updated: EventPayload<Id>;
  theme_deleted: EventPayload<Id>;

  session_created: EventPayload<Id>;

  settings_config_updated: EventPayload<SettingsConfig>;
  timer_config_updated: EventPayload<TimerConfig>;

  timer_play: undefined;
  timer_skip: undefined;

  current_theme_changed: undefined;
  current_theme_updated: Theme;
  preview_theme: Theme;

  timer_session_updated: TimerSession;
  timer_queue_updated: Queue;
};

type Callback<T extends keyof Events> = (data: Events[T]) => void;

/**
Hook that registers event listeners and invokes the corresponding callbacks when events are triggered.
@param callbacks An object that maps event types to their corresponding callbacks.

Events can be emitted by both backend and client side.
*/
export default function useEvents(callbacks: {
  [K in keyof Events]?: Callback<K>;
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
