import React from "react";
import { MdAddCircle, MdDelete, MdSearch } from "react-icons/md";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { useConfirmDelete, useEvents } from "@/hooks";
import { Button } from "@/components";
import CreateNote from "./CreateNote";
import FilterNotes from "./FilterNotes";
import NoteView from "./NoteView";

const NotesView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
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
        display={!viewCreate}
        toggleViewCreate={() => setViewCreate(true)}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
        selectedNotesIds={selectedNotesIds}
        setSelectedNotesIds={setSelectedNotesIds}
      />

      {viewCreate ? (
        <CreateNote hide={() => setViewCreate(false)} />
      ) : (
        <NotesList
          innerRef={notesRef}
          filter={filterQuery}
          selectedNotesIds={selectedNotesIds}
          setSelectedNotesIds={setSelectedNotesIds}
        />
      )}
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
    <motion.div
      className="flex flex-row gap-0.5"
      transition={{ delay: 0.1, duration: 0.3 }}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 36 }}
    >
      {!viewFilter ? (
        <React.Fragment>
          <div className="w-full window">
            <Button
              onClick={() => props.toggleViewCreate()}
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

          <div className="window">
            <Button
              onClick={() => setViewFilter(true)}
              transparent
              transition={{ delay: 0.2, duration: 0.3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
            >
              <MdSearch size={24} />
            </Button>
          </div>
        </React.Fragment>
      ) : (
        <FilterNotes
          query={props.filterQuery}
          setQuery={props.setFilterQuery}
          toggleDisplay={() => setViewFilter(false)}
        />
      )}

      <DeleteMultiButton
        display={!viewFilter && props.selectedNotesIds.length > 0}
        selectedNotesIds={props.selectedNotesIds}
        setSelectedNotesIds={props.setSelectedNotesIds}
      />
    </motion.div>
  );
};

interface NotesListProps {
  innerRef: React.RefObject<HTMLDivElement>;
  filter: string;
  selectedNotesIds: string[];
  setSelectedNotesIds: React.Dispatch<React.SetStateAction<string[]>>;
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

  return (
    <div
      id="notes-container"
      className="grow flex flex-col p-1.5 bg-window/90 border-2 border-base/80 rounded"
    >
      <div className="grow flex flex-col overflow-y-auto gap-1 pb-2">
        <div
          ref={props.innerRef}
          className="w-full max-h-0 flex flex-col gap-1 pb-0.5"
        >
          {notes.map((note) => (
            <NoteView
              key={note.id}
              data={note}
              selectedNotesIds={props.selectedNotesIds}
              setSelectedNotesIds={props.setSelectedNotesIds}
            />
          ))}
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
  const { viewConfirmDelete, onDelete } = useConfirmDelete();

  if (!props.display) return null;

  return (
    <div className="bg-window/90 border-2 border-base/80 rounded">
      <Button
        onClick={() =>
          onDelete(() =>
            ipc.deleteNotes(props.selectedNotesIds).then(() => {
              props.setSelectedNotesIds([]);
              toast("Notes deleted");
            })
          )
        }
        transparent
        color="danger"
      >
        {!viewConfirmDelete && <MdDelete size={20} />}
        <div>
          {viewConfirmDelete ? "Confirm" : props.selectedNotesIds.length}
        </div>
      </Button>
    </div>
  );
};

export default NotesView;
