import React from "react";

import { IntentsSort } from "@/types";
import { Intent } from "@/bindings/Intent";
import IntentListItem from "./IntentListItem";

interface Props {
  data: Intent[];
  selectedIntentId?: string;
  selectedTags: string[];
  sort?: IntentsSort;
  onSelected: (data?: Intent) => void;
  onTagSelected: (tags: string[]) => void;
}

export const IntentsList: React.FC<Props> = (props) => {
  // append or remove given tag from selectedTags array
  const onTagSelect = (tag: string) => {
    const tags = props.selectedTags.includes(tag)
      ? props.selectedTags.filter((t) => t !== tag)
      : [tag, ...props.selectedTags];

    props.onTagSelected(tags);
  };

  // selects or unselects given intent
  const onSelected = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: Intent
  ) => {
    // @ts-ignore - abort if child button element was clicked
    if (e.target.closest("button")) return;

    props.onSelected(props.selectedIntentId === data.id ? undefined : data);
  };

  let intents = props.data;

  // sorts alphabeticaly based on props.sort
  if (props.sort === "desc") {
    intents.sort((a, b) =>
      b.label.toLowerCase().localeCompare(a.label.toLowerCase())
    );
  } else {
    intents.sort((a, b) =>
      a.label.toLowerCase().localeCompare(b.label.toLowerCase())
    );
  }

  // sorts by pinned (meaning pinned intents are always first)
  intents.sort((a, b) => (a.pinned ? 0 : 1) - (b.pinned ? 0 : 1));

  // sort by archived (meaning archive intents are always at the bottom)
  intents.sort((a, b) => (b.archived_at ? 0 : 1) - (a.archived_at ? 0 : 1));

  // filter by selectedTags
  if (props.selectedTags.length === 1) {
    intents = intents.filter((intent) =>
      props.selectedTags.some((tag) => intent.tags.includes(tag))
    );
  } else if (props.selectedTags.length > 1) {
    intents = intents.filter((intent) =>
      props.selectedTags.every((tag) => intent.tags.includes(tag))
    );
  }

  return intents.length > 0 ? (
    <div className="grow flex overflow-y-auto rounded-sm">
      <div className="w-full max-h-0 flex flex-col gap-1.5 overflow-y font-semibold">
        {intents.map((intent) => (
          <IntentListItem
            key={intent.id}
            data={intent}
            selected={props.selectedIntentId === intent.id}
            selectedTags={props.selectedTags}
            onSelected={onSelected}
            onTagSelect={onTagSelect}
          />
        ))}
      </div>
    </div>
  ) : (
    <div className="m-auto text-sm text-text/80 text-center">
      <p>Create some intents and give your pomodoros a purpose!</p>
    </div>
  );
};

export default IntentsList;
