import React from "react";

import { Intent } from "@/bindings/Intent";
import { IntentView } from "./IntentView";

export interface IntentListProps {
  data: Intent[];
  selectedIntent?: Intent;
  onIntentSelected?: (intent?: Intent) => void;
}

export const IntentList: React.FC<IntentListProps> = (props) => {
  const intents = React.useMemo(() => {
    let intents = props.data;

    intents.sort((a, b) =>
      a.label.toLowerCase().localeCompare(b.label.toLowerCase())
    );

    // sorts by pinned (meaning pinned intents are always first)
    intents.sort((a, b) => (a.pinned ? 0 : 1) - (b.pinned ? 0 : 1));

    return intents;
  }, [props.data]);

  return (
    <div className="grow flex overflow-y-auto rounded-sm">
      <div className="w-full max-h-0 flex flex-col gap-1 overflow-y font-semibold">
        {intents.map((intent) => (
          <IntentView
            key={intent.id}
            data={intent}
            onClick={() =>
              props.onIntentSelected?.(
                props.selectedIntent?.id === intent.id ? undefined : intent
              )
            }
            active={props.selectedIntent?.id === intent.id}
          />
        ))}
      </div>
    </div>
  );
};
