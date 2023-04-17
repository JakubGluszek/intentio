import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Editor } from "@/components";
import utils from "@/utils";
import { Script } from "@/bindings/Script";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";
import { Button } from "@/ui";

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
    <form onSubmit={onSubmit} className="grow flex flex-col gap-0.5">
      <input
        placeholder="Script label"
        className="window bg-window"
        autoComplete="off"
        maxLength={24}
        {...register("label", { required: true, minLength: 1, maxLength: 24 })}
      />
      <Editor lang="shell" value={body} onChange={setBody} />
      <div className="h-10 flex flex-row items-center justify-between window bg-window p-1">
        <button
          className="text-text/80 hover:text-primary/80 px-1"
          onClick={() => props.onExit()}
          type="button"
        >
          Exit
        </button>
        <div className="h-full flex flex-row items-center gap-2">
          <button
            type="button"
            className="text-text/80 hover:text-primary/80"
            onClick={() => utils.executeScript(body)}
          >
            Test
          </button>
          <Button variant="base" type="submit">
            Update
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EditScript;
