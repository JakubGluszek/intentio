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
import TagButton from "../TagButton";
import { TagsModal } from "./TagsModal";
import { Button, Card } from "@/ui";

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
      <Card
        onClick={(e) => props.onSelected(e, data)}
        onContextMenu={onContextMenuHandler}
        ref={container}
        active={props.selected}
        data-tauri-disable-drag
      >
        {/* Label */}
        <div className="w-full flex flex-row items-center gap-1">
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
      </Card>

      <ContextMenu {...menu}>
        <React.Fragment>
          <Button
            variant="base"
            onClick={() =>
              ipc
                .updateIntent(props.data.id, { pinned: !props.data.pinned })
                .then((data) => {
                  menu.hide();
                  toast(data.pinned ? "Pinned to top" : "Unpinned");
                })
            }
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
            variant="base"
            onClick={() => {
              setViewTagsModal(true);
              menu.hide();
            }}
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
