import React from "react";
import { MdAddCircle } from "react-icons/md";

import { Button, IconView } from "@/ui";
import ipc from "@/ipc";
import { TimerSession } from "@/bindings/TimerSession";
import { useTasks } from "@/hooks";
import { CreateTaskModal } from "./CreateTaskModal";

export const TasksView: React.FC = () => {
  const [viewCreateTask, setViewCreateTask] = React.useState(false);
  const [session, setSession] = React.useState<TimerSession | null>(null);

  const tasks = useTasks();

  React.useEffect(() => {
    ipc.timerGetSession().then((data) => setSession(data));
  }, []);

  React.useEffect(() => {
    tasks.getList({
      limit: null,
      offset: null,
      completed: null,
      intent_id: session?.intent.id ?? null,
    });
  }, [session]);

  return (
    <>
      <nav className="h-8 flex flex-row gap-0.5 rounded-[1px] overflow-clip">
        {/* Heading */}
        <div className="flex-1 flex flex-row items-center gap-1 px-1 text-text/80 bg-base/5 border border-base/5">
          <span className="font-bold uppercase text-lg">Tasks</span>
        </div>
        {/* Button Bar */}
        <div className="w-fit flex flex-row items-center px-2 gap-2 bg-base/5 border border-base/5">
          {session && (
            <Button onClick={() => setViewCreateTask(true)} variant="ghost">
              <IconView icon={MdAddCircle} />
            </Button>
          )}
        </div>
      </nav>

      <div className="grow flex flex-col gap-1"></div>

      {session && (
        <CreateTaskModal
          display={viewCreateTask}
          intentId={session.intent.id}
          onExit={() => setViewCreateTask(false)}
        />
      )}
    </>
  );
};
