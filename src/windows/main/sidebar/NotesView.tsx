import React from "react";
import {
  MdAddCircle,
  MdCircle,
  MdClose,
  MdDelete,
  MdSearch,
} from "react-icons/md";
import { IoMdClipboard } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useClickOutside } from "@mantine/hooks";
import { clsx, Textarea } from "@mantine/core";
import { writeText } from "@tauri-apps/api/clipboard";

import useStore from "@/store";
import ipc from "@/ipc";
import { useContextMenu, useEvent } from "@/hooks";
import { Button, ContextMenu } from "@/components";
import { Note } from "@/bindings/Note";

const NotesView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewFilter, setViewFilter] = React.useState(false);
  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  const store = useStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  var notes = useStore((state) => state.notes);
  notes = notes.filter((note) => note.intent_id === store.activeIntentId);

  if (filterQuery.length > 0) {
    let query = filterQuery.toLowerCase();
    notes = notes.filter((note) => note.body.toLowerCase().includes(query));
  }

  notes = notes.sort((a, b) =>
    parseInt(a.created_at) > parseInt(b.created_at) ? -1 : 1
  );

  useEvent("note_created", (event) => {
    store.addNote(event.payload);
    containerRef.current?.scrollIntoView({ block: "start" });
  });
  useEvent("note_updated", (event) =>
    store.patchNote(event.payload.id, event.payload)
  );
  useEvent("note_deleted", (event) => store.removeNote(event.payload.id));
  useEvent("notes_deleted", (event) =>
    event.payload.forEach((data) => store.removeNote(data.id))
  );

  React.useEffect(() => {
    ipc.getNotes().then((data) => store.setNotes(data));
  }, []);

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

  React.useEffect(() => {
    setSelectedIds([]);
  }, [viewCreate, viewFilter]);

  return (
    <div className="grow flex flex-col overflow-y-auto pt-2 gap-1">
      <div className="w-full flex flex-row justify-between">
        {!viewFilter ? (
          <CreateNoteView
            viewCreate={viewCreate}
            setViewCreate={setViewCreate}
          />
        ) : null}
        <div
          className={clsx(
            "flex flex-row items-center gap-2",
            viewFilter ? "w-full" : "w-fit"
          )}
        >
          {!viewCreate ? (
            <FilterNotesView
              query={filterQuery}
              setQuery={setFilterQuery}
              viewFilter={viewFilter}
              setViewFilter={setViewFilter}
            />
          ) : null}
          {!viewCreate && !viewFilter && selectedIds.length > 0 ? (
            <>
              {!viewConfirmDelete ? (
                <Button
                  // @ts-ignore
                  onClick={() => setViewConfirmDelete(true)}
                  transparent
                  color="danger"
                >
                  <MdDelete size={20} />
                  <div>{selectedIds.length}</div>
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    ipc.deleteNotes(selectedIds).then(() => {
                      setSelectedIds([]);
                      setViewConfirmDelete(false);
                      toast("Notes deleted");
                    })
                  }
                  transparent
                  color="danger"
                >
                  Confirm
                </Button>
              )}
            </>
          ) : null}
        </div>
      </div>

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
              <NoteView
                key={note.id}
                data={note}
                selectedNotesIds={selectedIds}
                setSelectedNotesIds={!viewFilter ? setSelectedIds : undefined}
              />
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

  return (
    <>
      <div
        ref={ref}
        className={clsx(
          "min-h-fit flex flex-col gap-1.5 p-1 rounded shadow text-sm",
          isSelected
            ? "bg-base/80 hover:bg-base"
            : "bg-window/80 hover:bg-window"
        )}
        onContextMenu={(e) => {
          if (viewEdit) return;

          onContextMenuHandler(e);

          props.setSelectedNotesIds && props.setSelectedNotesIds([]);
        }}
        onMouseDown={(e) => {
          // @ts-ignore
          if (e.target.closest("button") || e.button === 2 || viewModal) return;

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

interface FilterNotesViewProps {
  query: string;
  setQuery: (q: string) => void;
  viewFilter: boolean;
  setViewFilter: (view: boolean) => void;
}

const FilterNotesView: React.FC<FilterNotesViewProps> = (props) => {
  return !props.viewFilter ? (
    <Button transparent onClick={() => props.setViewFilter(true)}>
      <MdSearch size={24} />
    </Button>
  ) : (
    <div className="w-full">
      <div className="relative">
        <input
          tabIndex={-2}
          className="input"
          autoFocus
          placeholder='Press "ESCAPE" to exit'
          autoComplete="off"
          value={props.query}
          onChange={(e) => props.setQuery(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key !== "Escape") return;
            props.setQuery("");
            props.setViewFilter(false);
          }}
        />
        {props.query.length > 1 ? (
          <Button
            style={{
              position: "absolute",
              right: 4,
              top: 6,
            }}
            transparent
            onClick={() => {
              props.setQuery("");
              props.setViewFilter(false);
            }}
          >
            <MdClose size={24} />
          </Button>
        ) : null}
      </div>
    </div>
  );
};

interface CreateNoteViewProps {
  viewCreate: boolean;
  setViewCreate: (view: boolean) => void;
}

const CreateNoteView: React.FC<CreateNoteViewProps> = (props) => {
  const [body, setBody] = React.useState("");

  const store = useStore();
  const ref = useClickOutside(() => {
    props.setViewCreate(false);
    setBody("");
  });

  const onSubmit = () => {
    if (body.length === 0) return;
    ipc
      .createNote({ body, intent_id: store.activeIntentId! })
      .then(() => {
        toast("Note created");
        setBody("");
        props.setViewCreate(false);
      })
      .catch((err) => console.log("ipc.createNote", err));
  };

  return !props.viewCreate ? (
    <Button transparent onClick={() => props.setViewCreate(true)}>
      <MdAddCircle size={20} />
      <span>Add note</span>
    </Button>
  ) : (
    <div className="w-full" ref={ref}>
      <NoteInput
        value={body}
        onChange={(value) => setBody(value)}
        onSubmit={onSubmit}
        onEscape={() => {
          setBody("");
          props.setViewCreate(false);
        }}
      />
    </div>
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
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

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
          <IoMdClipboard size={20} />
          <div className="w-full">Copy</div>
        </Button>
        {!viewConfirmDelete ? (
          <Button
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
              ipc.deleteNote(props.data.id).then(() => toast("Note deleted"))
            }
            rounded={false}
            color="danger"
          >
            Confirm
          </Button>
        )}
      </React.Fragment>
    </ContextMenu>
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
      autoComplete="off"
      classNames={{
        input:
          "bg-darker/20 border-2 text-[15px] border-primary/80 focus:border-primary/80 text-text p-1 pt-1.5 placeholder:text-text/50 placeholder:font-mono placeholder:text-sm",
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
