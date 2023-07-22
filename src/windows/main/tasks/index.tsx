import React from "react";
import {
  MdAddCircle,
  MdCheck,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
} from "react-icons/md";

import { Button, IconView } from "@/ui";
import ipc from "@/ipc";
import { TimerSession } from "@/bindings/TimerSession";

import { CreateTaskModal } from "./CreateTaskModal";
import TaskView from "./TaskView";
import { useIntentTasks } from "@/hooks";

export const TasksView: React.FC = () => {
  const [viewCreateTask, setViewCreateTask] = React.useState(false);
  const [session, setSession] = React.useState<TimerSession | null>(null);
  const [viewCompleted, setViewCompleted] = React.useState(false);

  React.useEffect(() => {
    ipc.timerGetSession().then((data) => setSession(data));
  }, []);

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
          <Button
            onClick={() => setViewCompleted((prev) => !prev)}
            variant="ghost"
          >
            <IconView
              icon={viewCompleted ? MdCheckBoxOutlineBlank : MdCheckBox}
            />
          </Button>
        </div>
      </nav>

      <div className="grow flex flex-col">
        {session ? (
          <TasksList
            intentId={session.intent.id}
            viewCompleted={viewCompleted}
          />
        ) : (
          <div className="m-auto">Select an intent to create a task</div>
        )}
      </div>

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

interface TasksListProps {
  intentId: number;
  viewCompleted: boolean;
}

const TasksList: React.FC<TasksListProps> = (props) => {
  const tasks = useIntentTasks(props.intentId, props.viewCompleted);

  return (
    <div className="grow flex flex-col gap-0.5">
      {tasks.data.map((task) => (
        <TaskView key={task.id} data={task} />
      ))}
    </div>
  );
};
