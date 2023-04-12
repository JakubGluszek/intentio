import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button, Editor } from "@/components";
import utils from "@/utils";
import { Script } from "@/bindings/Script";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";

interface Props {
  data: Script;
  onExit: () => void;
}

const EditScript: React.FC<Props> = (props) => {
  const [body, setBody] = React.useState("");

  const store = useStore();

  const { register, handleSubmit, setValue } =
    useForm<Partial<ScriptForUpdate>>();

  const onSubmit = handleSubmit((data) => {
    ipc.updateScript(props.data.id, { ...data, body }).then((data) => {
      store.patchScript(data.id, data);
      props.onExit();
      toast("Script updated");
    });
  });

  React.useEffect(() => {
    setBody(props.data.body);
    setValue("label", props.data.label);
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="grow flex flex-col gap-1.5 p-1.5 window bg-window rounded-b"
    >
      <input
        placeholder="Script label"
        autoComplete="off"
        maxLength={24}
        {...register("label", { required: true, minLength: 1, maxLength: 24 })}
      />
      <Editor value={body} onChange={setBody} />
      <div className="h-7 flex flex-row items-center justify-between">
        <Button transparent highlight={false} onClick={() => props.onExit()}>
          Exit
        </Button>
        <div className="h-full flex flex-row items-center gap-2">
          <Button
            transparent
            highlight={false}
            onClick={async () => utils.executeScript(body)}
          >
            Test
          </Button>
          <Button type="submit" style={{ width: "fit-content" }}>
            Update
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditScript;
