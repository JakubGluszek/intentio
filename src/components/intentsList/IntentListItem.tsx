import React from "react";
import { TiPin } from "react-icons/ti";
import { BiArchive } from "react-icons/bi";
import { clsx } from "@mantine/core";

import { Intent } from "@/bindings/Intent";
import { useContextMenu } from "@/hooks";
import ContextMenu from "../ContextMenu";
import Button from "../Button";
import ipc from "@/ipc";
import ModalContainer from "../ModalContainer";
import { useClickOutside } from "@mantine/hooks";
import { toast } from "react-hot-toast";

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
          "w-full h-fit flex flex-col border-2 p-1 rounded shadow transition-transform hover:-translate-y-[1px] bg-base/80 hover:bg-base",
          props.selected
            ? "border-primary/80 text-text"
            : "border-transparent text-text/80 hover:text-text/80"
        )}
        onClick={(e) => props.onSelected(e, data)}
        onContextMenu={onContextMenuHandler}
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

      {viewMenu ? (
        <IntentContextMenu
          data={props.data}
          leftPosition={viewMenu.leftPosition}
          topPosition={viewMenu.topPosition}
          hide={() => setViewMenu(undefined)}
          setViewTagsModal={setViewTagsModal}
        />
      ) : null}

      {viewTagsModal ? (
        <TagsModalView hide={() => setViewTagsModal(false)} />
      ) : null}
    </React.Fragment>
  );
};

interface IntentContextMenuProps {
  data: Intent;
  leftPosition: number;
  topPosition: number;
  hide: () => void;
  setViewTagsModal: (bool: boolean) => void;
}

const IntentContextMenu: React.FC<IntentContextMenuProps> = (props) => {
  return (
    <ContextMenu
      leftPosition={props.leftPosition}
      topPosition={props.topPosition}
      hide={props.hide}
    >
      <div className="w-24 flex flex-col gap-0.5">
        <Button
          onClick={() =>
            ipc
              .updateIntent(props.data.id, { pinned: !props.data.pinned })
              .then((data) => {
                props.hide();
                toast(data.pinned ? "Pinned to top" : "Unpinned");
              })
          }
          rounded={false}
        >
          {props.data.pinned ? "Unpin" : "Pin"}
        </Button>
        <Button
          onClick={() => {
            props.setViewTagsModal(true);
            props.hide();
          }}
          rounded={false}
        >
          Tags
        </Button>
      </div>
    </ContextMenu>
  );
};

interface TagsModalViewProps {
  hide: () => void;
}

const TagsModalView: React.FC<TagsModalViewProps> = (props) => {
  const ref = useClickOutside(() => props.hide());

  return (
    <ModalContainer>
      <div ref={ref}>Tags CRUD</div>
    </ModalContainer>
  );
};

export default IntentListItem;
