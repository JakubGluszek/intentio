import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button, Editor } from "@/components";
import utils from "@/utils";
import { ScriptForCreate } from "@/bindings/ScriptForCreate";

interface CreateScriptViewProps {
  onExit: () => void;
}

const CreateScript: React.FC<CreateScriptViewProps> = (props) => {
  const [body, setBody] = React.useState("");

  const store = useStore();
  const { register, handleSubmit } = useForm<ScriptForCreate>();

  const onSubmit = handleSubmit((data) => {
    ipc.createScript({ ...data, body }).then((data) => {
      store.addScript(data);
      props.onExit();
      toast("Script saved");
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grow flex flex-col gap-0.5"
    >
      <input
        placeholder="Script label"
        className="window bg-window"
        autoComplete="off"
        maxLength={24}
        {...register("label", { required: true, minLength: 1, maxLength: 24 })}
      />
      <Editor value={body} onChange={setBody} />
      <div className="h-10 flex flex-row items-center justify-between window bg-window">
        <Button onClick={() => props.onExit()} transparent highlight={false}>
          Exit
        </Button>
        <div className="h-full flex flex-row items-center gap-2">
          <Button
            onClick={() => utils.executeScript(body)}
            transparent
            highlight={false}
          >
            Test
          </Button>
          <Button type="submit" style={{ width: "fit-content" }}>
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CreateScript;
