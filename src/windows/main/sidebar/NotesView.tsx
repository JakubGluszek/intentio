import React from "react";
import {
  MdAddCircle,
  MdCircle,
  MdDelete,
  MdEdit,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { useClickOutside } from "@mantine/hooks";
import { toast } from "react-hot-toast";
import { Textarea } from "@mantine/core";
import { writeText } from "@tauri-apps/api/clipboard";

import useStore from "@/store";
import services from "@/services";
import { useEvent } from "@/hooks";
import { Button } from "@/components";
import { Note } from "@/bindings/Note";

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
  const [viewMore, setViewMore] = React.useState(false);
  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);
  const [viewExpand, setViewExpand] = React.useState(false);

  const ref = useClickOutside<HTMLDivElement>(() => {
    setViewMore(false);
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

  return (
    <div
      ref={ref}
      className="min-h-fit flex flex-col gap-1.5 p-1 bg-window/80 hover:bg-window rounded shadow text-sm"
      onMouseDown={(e) => {
        // @ts-ignore
        if (e.target.closest("button")) return;

        setViewExpand((prev) => !prev);
        setViewMore((prev) => !prev);

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
      }}
      data-tauri-disable-drag
    >
      {viewEdit === false ? (
        <>
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
          {viewMore ? (
            <div className="flex flex-row gap-1 h-5">
              <Button
                transparent
                onClick={async () => {
                  await writeText(body);
                  toast("Copied to clipboard");
                }}
              >
                <IoMdClipboard size={20} />
              </Button>
              <div className="w-full flex flex-row justify-end gap-2 rounded overflow-clip">
                <Button
                  transparent
                  onClick={() => setViewEdit(true)}
                  rounded={false}
                >
                  <MdEdit size={20} />
                </Button>
                {!viewConfirmDelete ? (
                  <Button
                    onClick={() => setViewConfirmDelete(true)}
                    transparent
                    rounded={false}
                    color="danger"
                  >
                    <MdDelete size={20} />
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      services
                        .deleteNote(data.id)
                        .then(() => toast("Note deleted"))
                    }
                    transparent
                    rounded={false}
                    color="danger"
                  >
                    Confirm
                  </Button>
                )}
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <NoteInput
          value={body}
          onChange={(value) => setBody(value)}
          onSubmit={() => onEditSubmit()}
          onEscape={() => {
            setViewEdit(false);
            setViewMore(false);
          }}
        />
      )}
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

export default NotesView;
