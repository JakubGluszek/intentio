import React from "react";
import { MdCancel } from "react-icons/md";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import ipc from "@/ipc";
import { Button } from "@/components";
import { Note } from "@/bindings/Note";
import NoteInput from "./NoteInput";
import motions from "@/motions";

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
    <motion.div className="grow flex flex-col gap-0.5" {...motions.scaleIn}>
      <NoteInput
        value={body}
        onChange={(value) => setBody(value)}
        onCtrlEnter={() => updateNote()}
      />

      <div className="h-9 flex flex-row gap-0.5">
        <div className="w-full window">
          <Button
            onClick={() => updateNote()}
            transparent
            style={{ width: "100%" }}
          >
            Update note
          </Button>
        </div>
        <div className="window">
          <Button onClick={() => props.hide()} transparent>
            <MdCancel size={24} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EditNote;