import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { useForm } from "react-hook-form";
import { Textarea } from "@mantine/core";
import { useSearchParams } from "react-router-dom";
import { MdClose, MdNotes } from "react-icons/md";
import { BiTargetLock } from "react-icons/bi";

import { WindowContainer } from "@/components";
import { Button, IconView } from "@/ui";
import { TimerSession } from "@/bindings/TimerSession";
import ipc from "@/ipc";
import { UpdateSession } from "@/bindings/UpdateSession";

const SummaryWindow: React.FC = () => {
  const [searchParams] = useSearchParams();

  const sessionId = parseInt(searchParams.get("sessionId")!);

  return (
    <WindowContainer>
      <Content sessionId={sessionId} />
    </WindowContainer>
  );
};

interface ContentProps {
  sessionId: number;
}

const Content: React.FC<ContentProps> = (props) => {
  return (
    <div className="w-[20rem] h-[21rem]">
      <div className="relative w-screen h-screen flex flex-col bg-window/95 border-2 border-base/5 rounded-md overflow-clip">
        {/* Header */}
        <header className="h-7 flex flex-row items-center justify-between bg-base/5 rounded-t px-1">
          <div className="flex flex-row items-center gap-1 text-text/80">
            <IconView icon={MdNotes} scale={1.1} />
            <span className="text-lg font-bold uppercase">Summary</span>
          </div>
          <Button variant="ghost" onClick={() => appWindow.close()}>
            <IconView icon={MdClose} />
          </Button>
        </header>
        {/* Main content */}
        <main className="grow flex flex-col gap-0.5 p-0.5">
          <SessionIntent />
          <SummaryForm {...props} />
        </main>
      </div>
    </div>
  );
};

const SummaryForm: React.FC<ContentProps> = (props) => {
  const { register, handleSubmit } = useForm<UpdateSession>();

  const onSubmit = handleSubmit((data) => {
    ipc.updateSession(props.sessionId, data).then(() => appWindow.close());
  });

  return (
    <form
      onSubmit={onSubmit}
      className="grow flex flex-col p-1 gap-1 bg-base/5"
    >
      <Textarea
        h="100%"
        classNames={{
          root: "h-full",
          wrapper: "h-full",
          input: "h-full bg-darker/20 border-none text-text p-2",
        }}
        minLength={1}
        maxLength={512}
        {...register("summary", {
          required: true,
          minLength: 1,
          maxLength: 512,
        })}
      />
      <Button variant="base" className="w-full" type="submit">
        Save
      </Button>
    </form>
  );
};

const SessionIntent: React.FC = () => {
  const [session, setSession] = React.useState<TimerSession | null>(null);

  React.useEffect(() => {
    ipc.timerGetSession().then((data) => setSession(data));
  }, []);

  if (!session) return null;

  return (
    <div className="flex flex-row items-center gap-1 px-1 text-lg bg-base/5 text-primary/80">
      <IconView icon={BiTargetLock} scale={1.1} />
      <span className="uppercase font-semibold">{session.intent.label}</span>
    </div>
  );
};

export default SummaryWindow;
