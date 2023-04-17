import React from "react";
import { MdCancel } from "react-icons/md";
import { toast } from "react-hot-toast";

import ipc from "@/ipc";
import { Editor } from "@/components";
import { Note } from "@/bindings/Note";
import { Button } from "@/ui";

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
    <div className="grow flex flex-col gap-1">
      <Editor lang="md" value={body} onChange={(value) => setBody(value)} />

      <div className="flex flex-row items-center justify-between">
        <Button variant="ghost" onClick={() => props.hide()}>
          <MdCancel size={20} />
          <div>Exit</div>
        </Button>

        <Button variant="base" onClick={() => updateNote()}>
          Update note
        </Button>
      </div>
    </div>
  );
};

export default EditNote;
