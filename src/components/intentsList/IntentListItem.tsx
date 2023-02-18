import React from "react";
import { TiPin } from "react-icons/ti";
import { BiArchive } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import { useContextMenu } from "@/hooks";
import { Intent } from "@/bindings/Intent";
import ContextMenu from "../ContextMenu";
import Button from "../Button";
import TagButton from "../TagButton";
import { TagsModal } from "./TagsModal";

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

  const [viewTagsModal, setViewTagsModal] = React.useState(false);
  const { viewMenu, setViewMenu, onContextMenuHandler } = useContextMenu();

  const container = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    props.selected &&
      container.current &&
      container.current.scrollIntoView({ block: "center" });
  }, []);

  return (
    <React.Fragment>
      <div
        ref={container}
        data-tauri-disable-drag
        className={clsx(
          "w-full h-fit flex flex-col p-1 rounded transition-transform",
          props.selected
            ? "bg-primary/60 hover:bg-primary/80 text-window -translate-y-[2px] shadow-xl"
            : "border-transparent bg-base/80 hover:bg-base text-text/80 hover:text-text shadow"
        )}
        onClick={(e) => props.onSelected(e, data)}
        onContextMenu={onContextMenuHandler}
      >
        {/* Label */}
        <div className="h-6 w-full flex flex-row items-center gap-1">
          <div className="w-full text-left whitespace-nowrap overflow-ellipsis overflow-hidden font-black">
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
          <div className="p-1 rounded bg-window shadow-inner">
            <div className="flex flex-row gap-1 overflow-x-auto rounded-sm">
              {data.tags.map((tag, i) => (
                <TagButton
                  key={i}
                  isSelected={props.selectedTags.includes(tag)}
                  onClick={() => props.onTagSelect(tag)}
                >
                  {tag}
                </TagButton>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {viewMenu ? (
        <ContextMenu
          leftPosition={viewMenu.leftPosition}
          topPosition={viewMenu.topPosition}
          hide={() => setViewMenu(undefined)}
        >
          <div className="w-24 flex flex-col gap-0.5">
            <Button
              onClick={() =>
                ipc
                  .updateIntent(props.data.id, { pinned: !props.data.pinned })
                  .then((data) => {
                    setViewMenu(undefined);
                    toast(data.pinned ? "Pinned to top" : "Unpinned");
                  })
              }
              rounded={false}
            >
              {props.data.pinned ? "Unpin" : "Pin"}
            </Button>
            <Button
              onClick={() => {
                setViewTagsModal(true);
                setViewMenu(undefined);
              }}
              rounded={false}
            >
              Tags
            </Button>
          </div>
        </ContextMenu>
      ) : null}

      {viewTagsModal ? (
        <TagsModal data={props.data} hide={() => setViewTagsModal(false)} />
      ) : null}
    </React.Fragment>
  );
};

export default IntentListItem;
