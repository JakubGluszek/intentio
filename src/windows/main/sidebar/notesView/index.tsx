import React from "react";
import { MdAddCircle, MdDelete, MdSearch } from "react-icons/md";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { useConfirmDelete, useEvents } from "@/hooks";
import { Button } from "@/components";
import { Note } from "@/bindings/Note";
import CreateNote from "./CreateNote";
import FilterNotes from "./FilterNotes";
import NoteView from "./NoteView";
import EditNote from "./EditNote";

const NotesView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [editNote, setEditNote] = React.useState<Note | null>(null);
  const [filterQuery, setFilterQuery] = React.useState("");
  const [selectedNotesIds, setSelectedNotesIds] = React.useState<string[]>([]);

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
    <motion.div
      className="grow flex flex-col gap-0.5"
      transition={{ duration: 0.3 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1.0, opacity: 1 }}
    >
      <Top
        display={!viewCreate && !editNote}
        toggleViewCreate={() => setViewCreate(true)}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
        selectedNotesIds={selectedNotesIds}
        setSelectedNotesIds={setSelectedNotesIds}
      />

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
    </motion.div>
  );
};

interface TopProps {
  display: boolean;
  toggleViewCreate: () => void;
  filterQuery: string;
  setFilterQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedNotesIds: string[];
  setSelectedNotesIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const Top: React.FC<TopProps> = (props) => {
  const [viewFilter, setViewFilter] = React.useState(false);

  if (!props.display) return null;

  return (
    <div className="flex flex-row gap-0.5">
      {!viewFilter ? (
        <React.Fragment>
          <div className="w-full window">
            <Button
              onClick={() => props.toggleViewCreate()}
              style={{ width: "100%" }}
              transparent
            >
              <MdAddCircle size={20} />
              <span>Add note</span>
            </Button>
          </div>

          <div className="window">
            <Button onClick={() => setViewFilter(true)} transparent>
              <MdSearch size={24} />
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <FilterNotes
          query={props.filterQuery}
          setQuery={props.setFilterQuery}
          hide={() => setViewFilter(false)}
        />
      )}

      <DeleteMultiButton
        display={!viewFilter && props.selectedNotesIds.length > 0}
        selectedNotesIds={props.selectedNotesIds}
        setSelectedNotesIds={props.setSelectedNotesIds}
      />
    </div>
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

  if (!props.display) return null;

  return (
    <div className="grow flex flex-col p-1.5 window">
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
      <Button onClick={() => onDelete()} transparent color="danger">
        {!viewConfirmDelete && <MdDelete size={20} />}
        <div>
          {viewConfirmDelete ? "Confirm" : props.selectedNotesIds.length}
        </div>
      </Button>
    </div>
  );
};

export default NotesView;
