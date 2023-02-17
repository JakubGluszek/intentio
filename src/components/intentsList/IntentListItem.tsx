import React from "react";
import { Intent } from "@/bindings/Intent";
import { clsx } from "@mantine/core";
import { TiPin } from "react-icons/ti";
import { BiArchive } from "react-icons/bi";

interface Props {
  data: Intent;
  selected: boolean;
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onSelected: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    data: Intent
  ) => void;
}

const IntentListItem: React.FC<Props> = (props) => {
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
        "w-full h-fit flex flex-col border-2 p-1 rounded shadow transition-transform hover:-translate-y-[1px] bg-base/80 hover:bg-base",
        props.selected
          ? "border-primary/80 text-text"
          : "border-transparent text-text/80 hover:text-text/80"
      )}
      onClick={(e) => props.onSelected(e, data)}
    >
      {/* Label */}
      <div className="h-6 w-full flex flex-row items-center gap-1">
        <div className="w-full text-left whitespace-nowrap overflow-ellipsis overflow-hidden">
          {data.label}
        </div>
        <div
          className={clsx(
            "flex flex-row items-center gap-1",
            !props.selected ? "text-text/60" : "text-text/80"
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

export default IntentListItem;
