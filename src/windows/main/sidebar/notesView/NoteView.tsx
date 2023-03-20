import React from "react";
import { MdCircle, MdDelete } from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useClickOutside } from "@mantine/hooks";
import { clsx } from "@mantine/core";
import { writeText } from "@tauri-apps/api/clipboard";

import ipc from "@/ipc";
import { useConfirmDelete, useContextMenu } from "@/hooks";
import { Button, ContextMenu } from "@/components";
import { Note } from "@/bindings/Note";
import NoteInput from "./NoteInput";

interface NoteViewProps {
  data: Note;
  selectedNotesIds: string[];
  setSelectedNotesIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const NoteView: React.FC<NoteViewProps> = (props) => {
  const { data } = props;

  const [body, setBody] = React.useState(data.body);
  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewExpand, setViewExpand] = React.useState(false);

  const { viewMenu, setViewMenu, onContextMenuHandler } = useContextMenu();

  const ref = useClickOutside<HTMLDivElement>(() => {
    setViewEdit(false);
    setViewExpand(false);
  });

  const onEditSubmit = () => {
    if (body.length === 0) return;
    ipc.updateNote(data.id, { body }).then(() => {
      setViewEdit(false);
      toast("Note updated");
    });
  };

  const isSelected = props.selectedNotesIds.includes(props.data.id);

  const scrollToView = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    var container = document.getElementById("notes-container")!;

    const elementIndex = Array.prototype.indexOf.call(
      e.currentTarget.parentNode!.childNodes,
      e.currentTarget
    );

    // scroll to top of container
    if (elementIndex === 0) {
      container.scrollTo({ top: 0 });
    }
    // scroll to bottom of container
    else if (
      elementIndex ===
      e.currentTarget.parentNode!.childNodes.length - 1
    ) {
      setTimeout(() => {
        container.scroll({ top: container.scrollHeight });
      }, 1);
    } else {
      e.currentTarget.scrollIntoView({ block: "start" });
    }
  };

  return (
    <>
      <div
        ref={ref}
        className={clsx(
          "min-h-fit flex flex-col gap-1.5 card rounded-sm text-sm p-0 bg-base/80 hover:bg-base",
          isSelected && "border-2 border-primary/50 hover:border-primary/60",
          viewEdit && "border-0"
        )}
        onContextMenu={(e) => {
          if (viewEdit) return;

          onContextMenuHandler(e);

          props.setSelectedNotesIds && props.setSelectedNotesIds([]);
        }}
        onMouseDown={(e) => {
          // @ts-ignore
          if (e.target.closest("button") || e.button === 2) return;

          if (e.ctrlKey) {
            if (isSelected) {
              props.setSelectedNotesIds &&
                props.setSelectedNotesIds((ids) =>
                  ids.filter((id) => id !== data.id)
                );
            } else {
              props.setSelectedNotesIds &&
                props.setSelectedNotesIds((ids) => [data.id, ...ids]);
            }
            return;
          }

          props.setSelectedNotesIds && props.setSelectedNotesIds([]);
          setViewExpand((prev) => !prev);
        }}
        onDoubleClick={(e) => {
          setViewEdit(true);
          scrollToView(e);
        }}
        data-tauri-disable-drag
      >
        {viewEdit === false ? (
          <div className="flex flex-row items-start gap-1">
            <div className="py-2 px-0.5 text-primary">
              <MdCircle size={8} />
            </div>
            <div
              className="mt-0.5 whitespace-pre-line"
              style={{ wordBreak: "break-word" }}
            >
              {data.body.length <= 128
                ? data.body
                : viewExpand
                  ? data.body
                  : `${data.body.slice(0, 128)}...`}
            </div>
          </div>
        ) : (
          <NoteInput
            value={body}
            onChange={(value) => setBody(value)}
            onSubmit={() => onEditSubmit()}
            onEscape={() => {
              setViewEdit(false);
            }}
          />
        )}
      </div>

      {viewMenu ? (
        <NoteContextMenu
          data={data}
          leftPosition={viewMenu.leftPosition}
          topPosition={viewMenu.topPosition}
          hide={() => setViewMenu(undefined)}
          setViewEdit={() => setViewEdit(true)}
        />
      ) : null}
    </>
  );
};

interface NoteContextMenuProps {
  data: Note;
  leftPosition: number;
  topPosition: number;
  hide: () => void;
  setViewEdit: () => void;
}

const NoteContextMenu: React.FC<NoteContextMenuProps> = (props) => {
  const { viewConfirmDelete, onDelete } = useConfirmDelete();

  return (
    <ContextMenu
      leftPosition={props.leftPosition}
      topPosition={props.topPosition}
      hide={props.hide}
    >
      <React.Fragment>
        <Button
          onClick={async () => {
            await writeText(props.data.body);
            toast("Copied to clipboard");
            props.hide();
          }}
          rounded={false}
        >
          <div className="w-fit">
            <IoMdClipboard size={20} />
          </div>
          <div className="w-full">Copy</div>
        </Button>
        <Button
          onClick={() =>
            onDelete(() =>
              ipc.deleteNote(props.data.id).then(() => toast("Note deleted"))
            )
          }
          rounded={false}
          color="danger"
        >
          <div className="w-fit">
            <MdDelete size={20} />
          </div>
          <div className="w-full">
            {viewConfirmDelete ? "Confirm" : "Delete"}
          </div>
        </Button>
      </React.Fragment>
    </ContextMenu>
  );
};

export default NoteView;
