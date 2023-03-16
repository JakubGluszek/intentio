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
import { motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { useContextMenu, useEvents } from "@/hooks";
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
  notes = notes.filter((note) => note.intent_id === store.currentIntent?.id);

  if (filterQuery.length > 0) {
    let query = filterQuery.toLowerCase();
    notes = notes.filter((note) => note.body.toLowerCase().includes(query));
  }

  notes = notes.sort((a, b) =>
    parseInt(a.created_at) > parseInt(b.created_at) ? -1 : 1
  );

  useEvents({
    note_created: (data) => {
      store.addNote(data);
      containerRef.current?.scrollIntoView({ block: "start" });
    },
    note_updated: (data) => store.patchNote(data.id, data),
    note_deleted: (data) => store.removeNote(data.id),
    notes_deleted: (data) => data.forEach((data) => store.removeNote(data.id)),
  });

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
    <motion.div
      className="grow flex flex-col gap-0.5"
      transition={{ duration: 0.3 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1.0, opacity: 1 }}
    >
      <motion.div
        className="flex flex-row gap-0.5"
        transition={{ delay: 0.1, duration: 0.3 }}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 36 }}
      >
        {!viewFilter ? (
          <CreateNoteView
            viewCreate={viewCreate}
            setViewCreate={setViewCreate}
          />
        ) : null}
        <div
          className={clsx(
            "flex flex-row gap-0.5",
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
            <div className="bg-window/90 border-2 border-base/80 rounded">
              {!viewConfirmDelete ? (
                <Button
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
            </div>
          ) : null}
        </div>
      </motion.div>

      <div
        id="notes-container"
        className="grow flex flex-col p-1.5 bg-window/90 border-2 border-base/80 rounded"
      >
        <div className="grow flex flex-col overflow-y-auto gap-1 pb-2">
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
      </div>
    </motion.div>
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

interface FilterNotesViewProps {
  query: string;
  setQuery: (q: string) => void;
  viewFilter: boolean;
  setViewFilter: (view: boolean) => void;
}

const FilterNotesView: React.FC<FilterNotesViewProps> = (props) => {
  return !props.viewFilter ? (
    <div className="bg-window/90 border-2 border-base/80 rounded">
      <Button
        onClick={() => props.setViewFilter(true)}
        transparent
        transition={{ delay: 0.2, duration: 0.3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        <MdSearch size={24} />
      </Button>
    </div>
  ) : (
    <div className="w-full animate-in fade-in-0 zoom-in-90">
      <div className="relative">
        <input
          tabIndex={-2}
          className="input bg-darker/90"
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
            onClick={() => {
              props.setQuery("");
              props.setViewFilter(false);
            }}
            style={{
              position: "absolute",
              right: 4,
              top: 6,
            }}
            transparent
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
    if (body.length === 0 || !store.currentIntent) return;
    ipc
      .createNote({ body, intent_id: store.currentIntent.id })
      .then(() => {
        toast("Note created");
        setBody("");
        props.setViewCreate(false);
      })
      .catch((err) => console.log("ipc.createNote", err));
  };

  return !props.viewCreate ? (
    <div className="w-full bg-window/90 border-2 border-base/80 rounded">
      <Button
        onClick={() => props.setViewCreate(true)}
        style={{ width: "100%" }}
        transparent
        transition={{ delay: 0.2, duration: 0.3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        <MdAddCircle size={20} />
        <span>Add note</span>
      </Button>
    </div>
  ) : (
    <div className="w-full animate-in fade-in-0 zoom-in-90" ref={ref}>
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
          <div className="w-fit">
            <IoMdClipboard size={20} />
          </div>
          <div className="w-full">Copy</div>
        </Button>
        {!viewConfirmDelete ? (
          <Button
            onClick={() => setViewConfirmDelete(true)}
            rounded={false}
            color="danger"
          >
            <div className="w-fit">
              <MdDelete size={20} />
            </div>
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
          "bg-darker/90 border-2 text-[15px] border-primary/80 focus:border-primary/80 text-text p-1 pt-1.5 placeholder:text-text/50 placeholder:font-mono placeholder:text-sm",
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
