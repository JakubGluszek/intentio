import React from "react";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button, Editor } from "@/components";
import utils from "@/utils";
import { Script } from "@/bindings/Script";

interface Props {
  data: Script;
  exit: () => void;
}

const EditScriptCode: React.FC<Props> = (props) => {
  const [body, setBody] = React.useState("");

  const store = useStore();

  const handleUpdate = () =>
    ipc.updateScript(props.data.id, { body }).then((data) => {
      store.patchScript(props.data.id, data);
      props.exit();
      toast("Script updated");
    });

  React.useEffect(() => {
    setBody(props.data.body);
  }, []);

  return (
    <div className="flex flex-col gap-2 p-1.5 bg-window rounded shadow text-sm">
      <Editor value={body} onChange={setBody} />
      <div className="h-6 flex flex-row items-center justify-between">
        <Button transparent onClick={() => props.exit()}>
          Exit
        </Button>
        <div className="h-full flex flex-row items-center gap-2">
          <Button transparent onClick={async () => utils.executeScript(body)}>
            Test
          </Button>
          <Button
            onClick={() => handleUpdate()}
            style={{ width: "fit-content" }}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditScriptCode;
