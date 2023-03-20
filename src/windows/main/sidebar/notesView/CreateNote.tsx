import React from "react";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import NoteInput from "./NoteInput";
import { Button } from "@/components";
import { MdCancel } from "react-icons/md";

interface Props {
  hide: () => void;
}

const CreateNote: React.FC<Props> = (props) => {
  const [body, setBody] = React.useState("");

  const store = useStore();

  const saveNote = () => {
    if (body.length === 0 || !store.currentIntent) return;
    ipc
      .createNote({ body, intent_id: store.currentIntent.id })
      .then(() => {
        toast("Note created");
        setBody("");
        props.hide();
      })
      .catch((err) => console.log("ipc.createNote", err));
  };

  return (
    <div className="grow flex flex-col gap-0.5">
      <NoteInput value={body} onChange={(value) => setBody(value)} />

      <div className="h-9 flex flex-row gap-0.5">
        <div className="w-full window">
          <Button
            onClick={() => saveNote()}
            transparent
            style={{ width: "100%" }}
          >
            Save note
          </Button>
        </div>
        <div className="window">
          <Button onClick={() => props.hide()} transparent>
            <MdCancel size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateNote;
