import React from "react";
import { toast } from "react-hot-toast";

import ipc from "@/ipc";
import { Editor } from "@/components";
import { Note } from "@/bindings/Note";
import { Button } from "@/ui";
import { MdCancel, MdSave } from "react-icons/md";

interface Props {
  note: Note;
  hide: () => void;
}

const EditNote: React.FC<Props> = (props) => {
  const [body, setBody] = React.useState("");

  const updateNote = () => {
    if (body.length === 0 || !props.note) return;

    ipc.updateNote(props.note.id, { body }).then(() => {
      props.hide();
      toast("Note updated");
    });
  };

  React.useEffect(() => {
    props.note && setBody(props.note.body);
  }, [props.note]);

  return (
    <Editor lang="md" value={body} onChange={(value) => setBody(value)}>
      <div className="absolute bottom-1 right-1 flex flex-row items-center justify-between">
        <Button
          variant="ghost"
          config={{ ghost: { highlight: false } }}
          onClick={() => props.hide()}
        >
          <MdCancel size={24} />
        </Button>

        <Button
          variant="ghost"
          config={{ ghost: { highlight: false } }}
          onClick={() => updateNote()}
        >
          <MdSave size={24} />
        </Button>
      </div>
    </Editor>
  );
};

export default EditNote;
