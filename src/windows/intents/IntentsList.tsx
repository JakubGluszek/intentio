import React from "react";
import { TiPin } from "react-icons/ti";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";

import { Intent, Sort } from ".";

interface Props {
  data: Intent[];
  selectedIntent: Intent | undefined;
  selectedTags: string[];
  sort?: Sort;
  onSelected: (intent?: Intent) => void;
  onTagSelected: (tags: string[]) => void;
}

export const IntentsList: React.FC<Props> = (props) => {
  const [containerRef] = useAutoAnimate<HTMLDivElement>();

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

    const newSelect = props.selectedIntent?.id === data.id ? undefined : data;

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
    <div className="grow flex overflow-y-auto p-1.5 bg-base rounded animate-in fade-in-0">
      <div
        ref={containerRef}
        className="w-full max-h-0 flex flex-col gap-1 overflow-y"
      >
        {intents.map((intent) => (
          <IntentView
            key={intent.id}
            data={intent}
            selected={props.selectedIntent?.id === intent.id}
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
        "w-full h-fit flex flex-col p-1 rounded transition-colors",
        props.selected
          ? "bg-primary/80 hover:bg-primary text-window"
          : "bg-window/80 hover:bg-window text-text"
      )}
      onClick={(e) => props.onSelected(e, data)}
    >
      {/* Label */}
      <div className="h-8 w-full flex flex-row items-center justify-between px-1">
        <span className="text-left whitespace-nowrap overflow-ellipsis overflow-hidden">
          {data.label}
        </span>
        {data.pinned ? (
          <TiPin
            size={24}
            className="min-w-[24px]"
          />
        ) : null}
      </div>

      {/* Tags */}
      {data.tags.length > 0 ? (
        <div
          className={clsx(
            "flex flex-row gap-2 p-1 rounded transition-colors",
            props.selected && "bg-window/80"
          )}
        >
          {data.tags.map((tag, i) => (
            <button
              key={i}
              className={clsx(
                "rounded text-sm font-semibold px-2 py-0.5 transition-colors",
                props.selectedTags.includes(tag)
                  ? "bg-primary/80 hover:bg-primary text-window/80"
                  : "bg-text/80 hover:bg-text text-window/80"
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
