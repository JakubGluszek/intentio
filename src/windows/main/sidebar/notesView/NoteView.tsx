import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { toast } from "react-hot-toast";
import { clsx } from "@mantine/core";
import { writeText } from "@tauri-apps/api/clipboard";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { useConfirmDelete, useContextMenu } from "@/hooks";
import { ContextMenu } from "@/components";
import { Note } from "@/bindings/Note";
import ipc from "@/ipc";
import { Button } from "@/ui";

interface NoteViewProps {
  data: Note;
  isSelected: boolean;
  setEdit: (note: Note | null) => void;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onContextMenu: () => void;
}

const NoteView: React.FC<NoteViewProps> = (props) => {
  const [menu, onContextMenuHandler] = useContextMenu();
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteNote(props.data.id).then(() => toast("Note deleted"))
  );

  return (
    <React.Fragment>
      <div
        className={clsx(
          "min-h-fit flex flex-col gap-1.5 card rounded-sm text-sm p-0.5 bg-base/20 hover:bg-base/40",
          props.isSelected &&
          "border-2 border-primary/50 hover:border-primary/60"
        )}
        onContextMenu={(e) => {
          onContextMenuHandler(e);
          props.onContextMenu();
        }}
        data-tauri-disable-drag
      >
        <ReactMarkdown
          children={props.data.body}
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ node, ...props }) => (
              <a
                {...props}
                className="text-primary/60 hover:text-primary/80"
                target="_blank"
              />
            ),
          }}
        />
      </div>

      <ContextMenu {...menu}>
        <div className="w-28 flex flex-col gap-0.5">
          <Button
            variant="base"
            onClick={() => {
              props.setEdit(props.data);
              menu.hide();
            }}
          >
            <div className="w-fit">
              <MdEdit size={20} />
            </div>
            <div className="w-full">Edit</div>
          </Button>
          <Button
            variant="base"
            onClick={async () => {
              await writeText(props.data.body);
              toast("Copied to clipboard");
              menu.hide();
            }}
          >
            <div className="w-fit">
              <IoMdClipboard size={20} />
            </div>
            <div className="w-full">Copy</div>
          </Button>
          <Button variant="base" onClick={() => onDelete()}>
            <div className="w-fit">
              <MdDelete size={20} />
            </div>
            <div className="w-full">
              {viewConfirmDelete ? "Confirm" : "Delete"}
            </div>
          </Button>
        </div>
      </ContextMenu>
    </React.Fragment>
  );
};

export default NoteView;
