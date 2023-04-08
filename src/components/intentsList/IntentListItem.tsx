import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { BiArchive, BiTargetLock } from "react-icons/bi";
import { TbTags } from "react-icons/tb";
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
  const [menu, onContextMenuHandler] = useContextMenu();

  const container = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    props.selected &&
      container.current &&
      container.current.scrollIntoView({ block: "center" });
  }, []);

  // sorts tags alphabeticaly
  let sortedTags = props.data.tags.sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  return (
    <React.Fragment>
      <div
        ref={container}
        data-tauri-disable-drag
        className={clsx(
          "w-full h-fit flex flex-col p-1 rounded-sm transition-all",
          props.selected
            ? "bg-primary/50 hover:bg-primary/60 text-window -translate-y-[1px] shadow-lg shadow-black/30"
            : "border-transparent bg-base/80 hover:bg-base text-text/80 hover:text-text shadow shadow-black/30"
        )}
        onClick={(e) => props.onSelected(e, data)}
        onContextMenu={onContextMenuHandler}
      >
        {/* Label */}
        <div className="h-6 w-full flex flex-row items-center gap-1">
          <BiTargetLock size={20} className="min-w-[20px]" />
          <div className="w-full text-left whitespace-nowrap overflow-ellipsis overflow-hidden font-black">
            {data.label}
          </div>
          <div
            className={clsx(
              "flex flex-row items-center gap-1",
              !props.selected ? "text-text/60" : "text-window"
            )}
          >
            {data.pinned ? <TiPin size={24} className="min-w-[24px]" /> : null}
            {data.archived_at ? (
              <BiArchive size={24} className="min-w-[24px]" />
            ) : null}
          </div>
        </div>

        {/* Tags */}
        {sortedTags.length > 0 ? (
          <div className="p-1 rounded shadow-inner shadow-black/20 bg-window">
            <div className="flex flex-row gap-1 overflow-x-auto rounded-sm">
              {sortedTags.map((tag, i) => (
                <TagButton
                  key={i}
                  isSelected={props.selectedTags.includes(tag)}
                  onClick={() => props.onTagSelect(tag)}
                >
                  <div className="px-1 py-0.5">{tag}</div>
                </TagButton>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <ContextMenu {...menu}>
        <React.Fragment>
          <Button
            onClick={() =>
              ipc
                .updateIntent(props.data.id, { pinned: !props.data.pinned })
                .then((data) => {
                  menu.hide();
                  toast(data.pinned ? "Pinned to top" : "Unpinned");
                })
            }
            rounded={false}
          >
            <div className="w-fit">
              {props.data.pinned ? (
                <TiPin size={20} />
              ) : (
                <TiPinOutline size={20} />
              )}
            </div>
            <div className="w-full">{props.data.pinned ? "Unpin" : "Pin"}</div>
          </Button>
          <Button
            onClick={() => {
              setViewTagsModal(true);
              menu.hide();
            }}
            rounded={false}
          >
            <div className="w-fit">
              <TbTags size={20} />
            </div>
            <div className="w-full">Tags</div>
          </Button>
        </React.Fragment>
      </ContextMenu>

      <TagsModal
        display={viewTagsModal}
        data={props.data}
        hide={() => setViewTagsModal(false)}
      />
    </React.Fragment>
  );
};

export default IntentListItem;
