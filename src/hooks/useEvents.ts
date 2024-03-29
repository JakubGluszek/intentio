import React from "react";
import { listen } from "@tauri-apps/api/event";

import { Theme } from "@/bindings/Theme";
import { TimerConfig } from "@/bindings/TimerConfig";
import { SettingsConfig } from "@/bindings/SettingsConfig";
import { EventPayload } from "@/bindings/EventPayload";
import { TimerSession } from "@/bindings/TimerSession";
import { Queue } from "@/bindings/Queue";
import { CreateIntentTag } from "@/bindings/CreateIntentTag";
import { DeleteIntentTag } from "@/bindings/DeleteIntentTag";
import { Notification } from "@/features/notification/types";

type Id = number;

type Events = {
  [key: string]: any;
  intent_created: Id;
  intent_updated: Id;
  intent_deleted: Id;
  intent_archived: Id;
  intent_unarchived: Id;
  intent_tag_created: CreateIntentTag;
  intent_tag_deleted: DeleteIntentTag;

  tag_created: Id;
  tag_updated: Id;
  tag_deleted: Id;

  task_created: EventPayload<Id>;
  task_updated: EventPayload<Id>;
  task_deleted: EventPayload<Id>;
  task_completed: EventPayload<Id>;
  task_uncompleted: EventPayload<Id>;

  script_created: EventPayload<Id>;
  script_updated: EventPayload<Id>;
  script_deleted: EventPayload<Id>;

  theme_created: EventPayload<Id>;
  theme_updated: EventPayload<Id>;
  theme_deleted: EventPayload<Id>;

  session_created: Id;
  session_updated: EventPayload<Id>;

  settings_config_updated: EventPayload<SettingsConfig>;
  timer_config_updated: EventPayload<TimerConfig>;

  timer_play: undefined;
  timer_skip: undefined;
  timer_session_updated: TimerSession;
  timer_queue_updated: Queue;

  current_theme_changed: undefined;
  current_theme_updated: Theme;
  preview_theme: Theme;

  focus_session_completed: undefined;
  break_completed: undefined;
  long_break_completed: undefined;
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
