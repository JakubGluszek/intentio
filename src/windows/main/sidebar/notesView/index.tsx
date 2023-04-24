import React from "react";
import { MdAddCircle, MdDelete, MdSearch } from "react-icons/md";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { useConfirmDelete, useEvents } from "@/hooks";
import { Note } from "@/bindings/Note";
import motions from "@/motions";
import CreateNote from "./CreateNote";
import FilterNotes from "./FilterNotes";
import NoteView from "./NoteView";
import EditNote from "./EditNote";
import { Button, Pane } from "@/ui";

const NotesView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [editNote, setEditNote] = React.useState<Note | null>(null);
  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedNotesIds, setSelectedNotesIds] = React.useState<string[]>([]);
  const [viewFilter, setViewFilter] = React.useState(false);

  const store = useStore();
  const notesRef = React.useRef<HTMLDivElement>(null);

  useEvents({
    note_created: (data) => {
      store.addNote(data);
      notesRef.current?.scrollIntoView({ block: "start" });
    },
    note_updated: (data) => store.patchNote(data.id, data),
    note_deleted: (data) => store.removeNote(data.id),
    notes_deleted: (data) => data.forEach((data) => store.removeNote(data.id)),
  });

  React.useEffect(() => {
    ipc.getNotes().then((data) => store.setNotes(data));
  }, []);

  return (
    <Pane className="grow flex flex-col gap-2">
      {!viewCreate && !editNote && (
        <div className="flex flex-row gap-1 items-center justify-between">
          {!viewFilter ? (
            <React.Fragment>
              <Button variant="base" onClick={() => setViewCreate(true)}>
                <MdAddCircle size={20} />
                <span>Add note</span>
              </Button>

              <Button variant="ghost" onClick={() => setViewFilter(true)}>
                <MdSearch size={24} />
              </Button>
            </React.Fragment>
          ) : (
            <FilterNotes
              query={filterQuery}
              setQuery={setFilterQuery}
              hide={() => setViewFilter(false)}
            />
          )}

          <DeleteMultiButton
            display={!viewFilter && selectedNotesIds.length > 0}
            selectedNotesIds={selectedNotesIds}
            setSelectedNotesIds={setSelectedNotesIds}
          />
        </div>
      )}

      {viewCreate && !editNote && (
        <CreateNote hide={() => setViewCreate(false)} />
      )}

      {editNote && <EditNote note={editNote} hide={() => setEditNote(null)} />}

      <NotesList
        display={!viewCreate && !editNote}
        innerRef={notesRef}
        filter={filterQuery}
        setEditNote={setEditNote}
        selectedNotesIds={selectedNotesIds}
        setSelectedNotesIds={setSelectedNotesIds}
      />
    </Pane>
  );
};

interface NotesListProps {
  display: boolean;
  innerRef: React.RefObject<HTMLDivElement>;
  filter: string;
  selectedNotesIds: string[];
  setSelectedNotesIds: React.Dispatch<React.SetStateAction<string[]>>;
  setEditNote: (note: Note | null) => void;
}

const NotesList: React.FC<NotesListProps> = (props) => {
  const store = useStore();

  let notes = store.notes.filter(
    (note) => note.intent_id === store.currentIntent?.id
  );

  if (props.filter.length > 0) {
    let query = props.filter.toLowerCase();
    notes = notes.filter((note) => note.body.toLowerCase().includes(query));
  }

  notes = notes.sort((a, b) =>
    parseInt(a.created_at) > parseInt(b.created_at) ? -1 : 1
  );

  const emptyFiller = React.useMemo(
    () =>
      [
        <>
          <p>
            No project notes detected, it's time to get organized and capture
            your progress.
          </p>
        </>,
        <>
          <p>
            Study sessions are more productive with notes, let's get started and
            take some.
          </p>
          <p>Let's liven it up!</p>
        </>,
        <>
          <p>Writing summaries helps condense information.</p>
          <p>Let's get started and create some!</p>
        </>,
      ][Math.floor(Math.random() * 3)],
    []
  );

  if (!props.display) return null;

  if (notes.length === 0)
    return (
      <motion.div
        className="grow flex flex-col items-center justify-center text-center text-sm text-text/60 gap-2 p-1.5"
        {...motions.scaleIn}
      >
        {emptyFiller}
      </motion.div>
    );

  return (
    <div className="grow flex flex-col overflow-y-auto gap-1 pb-2">
      <div
        ref={props.innerRef}
        className="w-full max-h-0 flex flex-col gap-1 pb-0.5"
      >
        {notes.map((note) => {
          let isSelected = props.selectedNotesIds.includes(note.id);

          return (
            <NoteView
              key={note.id}
              data={note}
              isSelected={isSelected}
              onMouseDown={(e) => {
                if (e.ctrlKey) {
                  if (isSelected) {
                    props.setSelectedNotesIds &&
                      props.setSelectedNotesIds((ids) =>
                        ids.filter((id) => id !== note.id)
                      );
                  } else {
                    props.setSelectedNotesIds &&
                      props.setSelectedNotesIds((ids) => [note.id, ...ids]);
                  }
                  return;
                }

                props.setSelectedNotesIds && props.setSelectedNotesIds([]);
              }}
              onContextMenu={() =>
                props.setSelectedNotesIds && props.setSelectedNotesIds([])
              }
              setEdit={props.setEditNote}
            />
          );
        })}
      </div>
    </div>
  );
};

interface DeleteMultiButtonProps {
  display: boolean;
  selectedNotesIds: string[];
  setSelectedNotesIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const DeleteMultiButton: React.FC<DeleteMultiButtonProps> = (props) => {
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteNotes(props.selectedNotesIds).then(() => {
      props.setSelectedNotesIds([]);
      toast("Notes deleted");
    })
  );

  if (!props.display) return null;

  return (
    <div className="window">
      <Button variant="ghost" onClick={() => onDelete()}>
        {!viewConfirmDelete && <MdDelete size={20} />}
        <div>
          {viewConfirmDelete ? "Confirm" : props.selectedNotesIds.length}
        </div>
      </Button>
    </div>
  );
};

export default NotesView;
