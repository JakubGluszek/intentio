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
import { MenuPosition } from "@/hooks/useContextMenu";

interface NoteViewProps {
  data: Note;
  isSelected: boolean;
  setEdit: (note: Note | null) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onContextMenu: () => void;
}

const NoteView: React.FC<NoteViewProps> = (props) => {
  const { data } = props;
  const [viewExpand, setViewExpand] = React.useState(false);
  const [menu, onContextMenuHandler] = useContextMenu();

  const ref = useClickOutside<HTMLDivElement>(() => {
    setViewExpand(false);
  });

  const noteBody =
    data.body.length <= 128
      ? data.body
      : viewExpand
        ? data.body
        : `${data.body.slice(0, 128)}...`;

  return (
    <React.Fragment>
      <div
        ref={ref}
        className={clsx(
          "min-h-fit flex flex-col gap-1.5 card rounded-sm text-sm p-0.5 bg-base/80 hover:bg-base",
          props.isSelected &&
          "border-2 border-primary/50 hover:border-primary/60"
        )}
        onContextMenu={(e) => {
          onContextMenuHandler(e);
          props.onContextMenu();
        }}
        onMouseDown={(e) => {
          // @ts-ignore
          if (e.target.closest("button") || e.button === 2) return;
          props.onMouseDown(e);
          setViewExpand((prev) => !prev);
        }}
        onDoubleClick={() => props.setEdit(data)}
        data-tauri-disable-drag
      >
        <div className="flex flex-row items-start gap-1">
          <div className="py-1.5 px-0.5 text-primary">
            <MdCircle size={8} />
          </div>
          <div
            className="whitespace-pre-line"
            style={{ wordBreak: "break-word" }}
          >
            {noteBody}
          </div>
        </div>
      </div>

      <NoteContextMenu
        {...menu}
        data={data}
        deleteNote={() =>
          ipc.deleteNote(props.data.id).then(() => {
            toast("Note deleted");
          })
        }
      />
    </React.Fragment>
  );
};

interface NoteContextMenuProps {
  display: boolean;
  data: Note;
  position?: MenuPosition;
  hide: () => void;
  deleteNote: () => void;
}

const NoteContextMenu: React.FC<NoteContextMenuProps> = (props) => {
  const { viewConfirmDelete, onDelete } = useConfirmDelete(props.deleteNote);

  return (
    <ContextMenu
      display={props.display}
      position={props.position}
      hide={props.hide}
    >
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
      <Button onClick={() => onDelete()} rounded={false} color="danger">
        <div className="w-fit">
          <MdDelete size={20} />
        </div>
        <div className="w-full">{viewConfirmDelete ? "Confirm" : "Delete"}</div>
      </Button>
    </ContextMenu>
  );
};

export default NoteView;
