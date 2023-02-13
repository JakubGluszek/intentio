import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Textarea } from "@mantine/core";

import useStore from "@/store";
import services from "@/services";
import { Button } from "@/components";
import utils from "@/utils";
import { Script } from "@/bindings/Script";
import { ScriptForUpdate } from "@/bindings/ScriptForUpdate";

interface Props {
  data: Script;
  exit: () => void;
}

const EditScriptCode: React.FC<Props> = (props) => {
  const store = useStore();
  const { register, handleSubmit, watch, setValue } =
    useForm<ScriptForUpdate>();

  const onSubmit = handleSubmit((data) => {
    services.updateScript(props.data.id, data).then((data) => {
      store.patchScript(props.data.id, data);
      props.exit();
      toast("Script updated");
    });
  });

  React.useEffect(() => {
    setValue("body", props.data.body);
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-2 p-1.5 bg-window rounded shadow"
    >
      <Textarea
        autoFocus
        autosize
        maxRows={12}
        {...register("body", { required: true, minLength: 1, maxLength: 8192 })}
      />
      <div className="h-7 flex flex-row items-center justify-between">
        <Button transparent onClick={() => props.exit()}>
          Exit
        </Button>
        <div className="h-full flex flex-row items-center gap-2">
          <Button
            transparent
            onClick={async () => utils.executeScript(watch("body")!)}
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

export default EditScriptCode;
