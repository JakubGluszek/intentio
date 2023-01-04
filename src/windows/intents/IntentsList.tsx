import React from "react";
import { TiPin } from "react-icons/ti";
import clsx from "clsx";

import { Sort } from ".";
import { Intent } from "@/bindings/Intent";
import { BiArchive } from "react-icons/bi";

interface Props {
  data: Intent[];
  selectedIntentId?: string;
  selectedTags: string[];
  sort?: Sort;
  onSelected: (id?: string) => void;
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

    const newSelect = props.selectedIntentId === data.id ? undefined : data.id;

    props.onSelected(newSelect);
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

  return (
    <div className="grow flex overflow-y-auto">
      <div className="w-full max-h-0 flex flex-col gap-1 overflow-y">
        {intents.map((intent) => (
          <IntentView
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
  );
};

interface IntentViewProps {
  data: Intent;
  selected: boolean;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onSelected: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: Intent
  ) => void;
}

const IntentView: React.FC<IntentViewProps> = (props) => {
  const { data } = props;

  const container = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    props.selected &&
      container.current &&
      container.current.scrollIntoView({ block: "center" });
  }, []);

  return (
    <div
      ref={container}
      data-tauri-disable-drag
      className={clsx(
        "w-full h-fit flex flex-col p-1 rounded shadow",
        props.selected
          ? "bg-primary/80 hover:bg-primary text-window"
          : "bg-base/80 hover:bg-base text-text"
      )}
      onClick={(e) => props.onSelected(e, data)}
    >
      {/* Label */}
      <div className="h-6 w-full flex flex-row items-center justify-between gap-1">
        <span className="text-left whitespace-nowrap overflow-ellipsis overflow-hidden">
          {data.label}
        </span>
        <div
          className={clsx(
            "flex flex-row items-center gap-1",
            !props.selected && "text-text/70"
          )}
        >
          {data.pinned ? <TiPin size={24} className="min-w-[24px]" /> : null}
          {data.archived_at ? (
            <BiArchive size={24} className="min-w-[24px]" />
          ) : null}
        </div>
      </div>

      {/* Tags */}
      {data.tags.length > 0 ? (
        <div
          className={clsx(
            "flex flex-row gap-2 p-1 rounded",
            props.selected && "bg-window"
          )}
        >
          {data.tags.map((tag, i) => (
            <button
              key={i}
              tabIndex={-1}
              className={clsx(
                "rounded text-sm font-semibold px-2 py-0.5",
                props.selectedTags.includes(tag)
                  ? "bg-primary/80 hover:bg-primary text-window/80"
                  : "bg-text/60 hover:bg-text/80 text-window"
              )}
              onClick={() => props.onTagSelect(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default IntentsList;
