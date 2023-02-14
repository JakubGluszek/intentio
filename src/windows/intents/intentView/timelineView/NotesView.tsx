import React from "react";
import { MdCircle } from "react-icons/md";

import { Note } from "@/bindings/Note";
import useStore from "@/store";

interface Props {
  intentId: string;
  date: string; // example: 2023-02-14
}

const NotesView: React.FC<Props> = (props) => {
  const notes = useStore().getNotesByDate(props.date, props.intentId);

  return (
    <div className="flex flex-col gap-1">
      {notes.map((note) => (
        <NoteView key={note.id} data={note} />
      ))}
    </div>
  );
};

interface NoteViewProps {
  data: Note;
}

const NoteView: React.FC<NoteViewProps> = (props) => {
  const { data } = props;

  const [viewExpand, setViewExpand] = React.useState(false);

  return (
    <div
      className="min-h-fit flex flex-col gap-1.5 p-1 rounded shadow text-sm bg-window/80 hover:bg-window"
      onMouseDown={() => setViewExpand((prev) => !prev)}
    >
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
    </div>
  );
};

export default NotesView;
