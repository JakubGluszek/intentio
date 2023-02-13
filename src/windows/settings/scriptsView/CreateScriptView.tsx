import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button, Editor } from "@/components";
import utils from "@/utils";
import { ScriptForCreate } from "@/bindings/ScriptForCreate";

interface CreateScriptViewProps {
  exit: () => void;
}

const CreateScriptView: React.FC<CreateScriptViewProps> = (props) => {
  const [body, setBody] = React.useState("");

  const store = useStore();
  const { register, handleSubmit } = useForm<ScriptForCreate>();

  const onSubmit = handleSubmit((data) => {
    ipc.createScript({ ...data, body }).then((data) => {
      store.addScript(data);
      props.exit();
      toast("Script saved");
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 p-1.5 bg-window rounded shadow text-sm"
    >
      <input
        className="border-transparent"
        placeholder="Script label"
        maxLength={24}
        {...register("label", { required: true, minLength: 1, maxLength: 24 })}
      />
      <Editor value={body} onChange={setBody} />
      <div className="h-6 flex flex-row items-center justify-between">
        <Button transparent onClick={() => props.exit()}>
          Exit
        </Button>
        <div className="h-full flex flex-row items-center gap-2">
          <Button transparent onClick={async () => utils.executeScript(body)}>
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

export default CreateScriptView;
