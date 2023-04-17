import React from "react";
import { toast } from "react-hot-toast";
import { MdCancel } from "react-icons/md";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button } from "@/ui";
import { Editor } from "@/components";

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
    <div className="grow flex flex-col gap-1">
      <Editor lang="md" value={body} onChange={(value) => setBody(value)} />

      <div className="flex flex-row justify-between">
        <Button variant="ghost" onClick={() => props.hide()}>
          <MdCancel size={20} />
          <div>Exit</div>
        </Button>

        <Button variant="base" onClick={() => saveNote()}>
          Save note
        </Button>
      </div>
    </div>
  );
};

export default CreateNote;
