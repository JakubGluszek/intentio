import React from "react";
import { useForm } from "react-hook-form";

import ipc from "@/ipc";
import { Editor } from "@/components";
import utils from "@/utils";
import { Button, Input, Pane } from "@/ui";
import { CreateScript } from "@/bindings/CreateScript";

interface CreateScriptViewProps {
  onExit: () => void;
}

const CreateScriptView: React.FC<CreateScriptViewProps> = (props) => {
  const [body, setBody] = React.useState("");

  const { register, handleSubmit } = useForm<CreateScript>();

  const onSubmit = handleSubmit((data) => {
    ipc.createScript({ ...data, body }).then(() => {
      props.onExit();
    });
  });

  return (
    <Pane className="grow flex flex-col" padding="lg">
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
              Create
            </Button>
          </div>
        </div>
      </form>
    </Pane>
  );
};

export default CreateScriptView;
