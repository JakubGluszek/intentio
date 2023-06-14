import React from "react";
import { useForm } from "react-hook-form";

import ipc from "@/ipc";
import { Editor } from "@/components";
import utils from "@/utils";
import { Button, Input, Pane } from "@/ui";
import { Script } from "@/bindings/Script";
import { UpdateScript } from "@/bindings/UpdateScript";

interface Props {
  data: Script;
  onExit: () => void;
}

const EditScript: React.FC<Props> = (props) => {
  const [body, setBody] = React.useState("");

  const { register, handleSubmit, setValue } = useForm<Partial<UpdateScript>>();

  const onSubmit = handleSubmit((data) => {
    ipc.updateScript(props.data.id, { ...data, body }).then(() => {
      props.onExit();
    });
  });

  React.useEffect(() => {
    setBody(props.data.body);
    setValue("label", props.data.label);
  }, []);

  return (
    <Pane className="grow flex flex-col">
      <form onSubmit={onSubmit} className="grow flex flex-col gap-1">
        <Input
          placeholder="Script label"
          maxLength={24}
          {...register("label", {
            required: true,
            minLength: 1,
            maxLength: 24,
          })}
        />
        <Editor lang="shell" value={body} onChange={setBody} />
        <div className="flex flex-row items-center justify-between">
          <Button variant="ghost" onClick={() => props.onExit()}>
            Exit
          </Button>
          <div className="h-full flex flex-row items-center gap-2">
            <Button variant="ghost" onClick={() => utils.executeScript(body)}>
              Test
            </Button>
            <Button type="submit" variant="base">
              Update
            </Button>
          </div>
        </div>
      </form>
    </Pane>
  );
};

export default EditScript;
