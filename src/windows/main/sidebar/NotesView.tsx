import React from "react";
import { createPortal } from "react-dom";
import { MdAddCircle, MdCircle, MdDelete, MdEdit } from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useClickOutside } from "@mantine/hooks";
import { Textarea } from "@mantine/core";
import { writeText } from "@tauri-apps/api/clipboard";

import useStore from "@/store";
import services from "@/services";
import { useEvent } from "@/hooks";
import { Button } from "@/components";
import { Note } from "@/bindings/Note";
import config from "@/config";

const NotesView: React.FC = () => {
  const store = useStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  var notes = useStore((state) => state.notes);
  notes = notes.filter((note) => note.intent_id === store.activeIntentId);

  useEvent("note_created", (event) => {
    store.addNote(event.payload);
    containerRef.current?.scrollIntoView({ block: "start" });
  });
  useEvent("note_updated", (event) =>
    store.patchNote(event.payload.id, event.payload)
  );
  useEvent("note_deleted", (event) => store.removeNote(event.payload.id));

  React.useEffect(() => {
    services.getNotes().then((data) => store.setNotes(data));
  }, []);

  return (
    <div className="grow flex flex-col overflow-y-auto pt-2 gap-1">
      <CreateNoteView />

      {notes.length > 0 ? (
        <div
          id="notes-container"
          className="grow flex flex-col overflow-y-auto gap-1"
        >
          <div
            ref={containerRef}
            className="w-full max-h-0 flex flex-col gap-1 pb-0.5"
          >
            {notes.map((note) => (
              <NoteView key={note.id} data={note} />
            ))}
          </div>
        </div>
      ) : null}

      {/* Some text to fill out the empty space */}
      {notes.length === 0 ? (
        <div className="flex flex-col gap-2 text-center m-auto text-text/50 text-sm">
          {
            [
              <>
                <p>
                  No project notes detected, it's time to get organized and
                  capture your progress.
                </p>
              </>,
              <>
                <p>
                  Study sessions are more productive with notes, let's get
                  started and take some.
                </p>
                <p>Let's liven it up!</p>
              </>,
              <>
                <p>Writing summaries helps condense information.</p>
                <p>Let's get started and create some!</p>
              </>,
            ][Math.floor(Math.random() * 3)]
          }
        </div>
      ) : null}
    </div>
  );
};

const CreateNoteView: React.FC = () => {
  const [body, setBody] = React.useState("");
  const [viewCreate, setViewCreate] = React.useState(false);

  const store = useStore();
  const ref = useClickOutside(() => {
    setViewCreate(false);
    setBody("");
  });

  const onSubmit = () => {
    if (body.length === 0) return;
    services
      .createNote({ body, intent_id: store.activeIntentId! })
      .then(() => {
        toast("Note created");
        setViewCreate(false);
      })
      .catch((err) => console.log("services.createNote", err));
  };

  return (
    <div>
      {!viewCreate ? (
        <Button onClick={() => setViewCreate(true)}>
          <MdAddCircle size={24} />
          <span>Add note</span>
        </Button>
      ) : (
        <div ref={ref}>
          <NoteInput
            value={body}
            onChange={(value) => setBody(value)}
            onSubmit={onSubmit}
            onEscape={() => {
              setViewCreate(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

interface NoteViewProps {
  data: Note;
}

const NoteView: React.FC<NoteViewProps> = (props) => {
  const { data } = props;

  const [body, setBody] = React.useState(data.body);
  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewExpand, setViewExpand] = React.useState(false);
  const [viewModal, setViewModal] = React.useState<{ x: number; y: number }>();

  const modalWidth = 120;
  const modalHeight = 92;

  const ref = useClickOutside<HTMLDivElement>(() => {
    setViewEdit(false);
    setViewExpand(false);
  });

  const onEditSubmit = () => {
    if (body.length === 0) return;
    services.updateNote(data.id, { body }).then(() => {
      setViewEdit(false);
      toast("Note updated");
    });
  };

  return (
    <>
      <div
        ref={ref}
        className="min-h-fit flex flex-col gap-1.5 p-1 bg-window/80 hover:bg-window rounded shadow text-sm"
        onContextMenu={(e) => {
          var x = e.pageX;
          var y = e.pageY;

          const root = config.webviews.main;
          const padding = 8;

          // fix possible x overflow
          if (x + modalWidth > root.width) {
            x = x - (x + modalWidth - root.width) - padding;
          }

          // fix possible y overflow
          if (y + modalHeight > root.height) {
            y = y - (y + modalHeight - root.height) - padding;
          }

          setViewModal({ x, y });
          scrollToView(e);
        }}
        onMouseDown={(e) => {
          // @ts-ignore
          if (e.target.closest("button") || e.button === 2 || viewModal) return;

          setViewExpand((prev) => !prev);
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

      {viewModal
        ? createPortal(
          <NoteModal
            data={data}
            x={viewModal.x}
            y={viewModal.y}
            width={modalWidth}
            height={modalHeight}
            hide={() => setViewModal(undefined)}
            setViewEdit={() => setViewEdit(true)}
          />,
          document.getElementById("root")!
        )
        : null}
    </>
  );
};

interface NoteModalProps {
  data: Note;
  x: number;
  y: number;
  width: number;
  height: number;
  hide: () => void;
  setViewEdit: () => void;
}

const NoteModal: React.FC<NoteModalProps> = (props) => {
  const [preventHide, setPreventHide] = React.useState(true);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);
  const [deleteBtn, setDeleteBtn] = React.useState<HTMLButtonElement | null>(
    null
  );

  React.useEffect(() => {
    let hideConfirm: NodeJS.Timeout | undefined;
    if (viewConfirmDelete) {
      hideConfirm = setTimeout(() => {
        setViewConfirmDelete(false);
      }, 3000);
    } else {
      hideConfirm && clearTimeout(hideConfirm);
    }

    return () => hideConfirm && clearTimeout(hideConfirm);
  }, [viewConfirmDelete]);

  const ref = useClickOutside<HTMLDivElement>(
    () => !preventHide && props.hide(),
    ["click", "contextmenu"],
    [deleteBtn]
  );

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPreventHide(false);
    }, 20);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        zIndex: 9999,
        position: "fixed",
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
      }}
      className="bg-base rounded shadow-lg text-sm p-0.5"
    >
      <div className="flex flex-col gap-0.5 overflow-clip rounded">
        <Button
          onClick={async () => {
            await writeText(props.data.body);
            toast("Copied to clipboard");
            props.hide();
          }}
          rounded={false}
        >
          <IoMdClipboard size={20} />
          <div className="w-full">Copy</div>
        </Button>
        <Button
          onClick={() => {
            props.setViewEdit();
            props.hide();
          }}
          rounded={false}
        >
          <MdEdit size={20} />
          <div className="w-full">Edit</div>
        </Button>
        {!viewConfirmDelete ? (
          <Button
            // @ts-ignore
            innerRef={setDeleteBtn}
            onClick={() => setViewConfirmDelete(true)}
            rounded={false}
            color="danger"
          >
            <MdDelete size={20} />
            <div className="w-full">Delete</div>
          </Button>
        ) : (
          <Button
            onClick={() =>
              services
                .deleteNote(props.data.id)
                .then(() => toast("Note deleted"))
            }
            rounded={false}
            color="danger"
          >
            Confirm
          </Button>
        )}
      </div>
    </div>
  );
};

interface NoteInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  onEscape: () => void;
  onSubmit: () => void;
}

const NoteInput: React.FC<NoteInputProps> = (props) => {
  return (
    <Textarea
      classNames={{
        input:
          "bg-window border-2 border-primary/80 focus:border-primary/80 text-text p-1 placeholder:text-text/50 placeholder:font-mono",
      }}
      value={props.value}
      onChange={(e) => {
        props.onChange(e.currentTarget.value);
        e.currentTarget.scrollIntoView({ block: "center" });
      }}
      onBlur={() => {
        props.onBlur && props.onBlur();
      }}
      placeholder="Press CTRL + ENTER to save"
      autoFocus
      autosize
      maxRows={11}
      minLength={1}
      maxLength={2048}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          props.onEscape();
        } else if (e.ctrlKey && e.key === "Enter") {
          props.onSubmit();
        }
      }}
    ></Textarea>
  );
};

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
  else if (elementIndex === e.currentTarget.parentNode!.childNodes.length - 1) {
    setTimeout(() => {
      container.scroll({ top: container.scrollHeight });
    }, 1);
  } else {
    e.currentTarget.scrollIntoView({ block: "start" });
  }
};

export default NotesView;
