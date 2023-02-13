import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Textarea } from "@mantine/core";

import useStore from "@/store";
import services from "@/services";
import { Button } from "@/components";
import utils from "@/utils";
import { ScriptForCreate } from "@/bindings/ScriptForCreate";

interface CreateScriptViewProps {
  exit: () => void;
}

const CreateScriptView: React.FC<CreateScriptViewProps> = (props) => {
  const store = useStore();
  const { register, handleSubmit, watch } = useForm<ScriptForCreate>();

  const onSubmit = handleSubmit((data) => {
    services.createScript(data).then((data) => {
      store.addScript(data);
      props.exit();
      toast("Script saved");
    });
  });

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 p-1.5 bg-window rounded shadow"
    >
      <input
        placeholder="Script label"
        maxLength={24}
        {...register("label", { required: true, minLength: 1, maxLength: 24 })}
      />
      <Textarea
        {...register("body", { required: true, minLength: 1, maxLength: 8192 })}
      />
      <div className="h-7 flex flex-row items-center justify-between">
        <Button transparent onClick={() => props.exit()}>
          Exit
        </Button>
        <div className="h-full flex flex-row items-center gap-2">
          <Button
            transparent
            onClick={async () => utils.executeScript(watch("body"))}
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

export default CreateScriptView;
