import React from "react";

import useStore from "@/store";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

interface Props {
  intentId: string;
  date: string; // example: 2023-02-14
}

const TasksView: React.FC<Props> = (props) => {
  const tasks = useStore().getTasksByDate(props.date, props.intentId);

  if (tasks.length === 0) return null;

  return (
    <div className="flex flex-col gap-1 p-1">
      {tasks.map((task) => (
        <div className="min-h-fit flex flex-col gap-1.5 p-1 rounded shadow text-sm bg-window/80 hover:bg-window">
          <div className="flex flex-row items-start gap-1">
            {!task.done ? (
              <div className="text-primary/50">
                <MdCheckBoxOutlineBlank size={24} />
              </div>
            ) : (
              <div className="text-primary/50">
                <MdCheckBox size={24} />
              </div>
            )}
            <div className="mt-0.5 text-text/80" style={{ wordBreak: "break-all" }}>
              {task.body}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksView;
