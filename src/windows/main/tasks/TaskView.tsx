import React from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import ipc from "@/ipc";
import { Task } from "@/bindings/Task";

import { TaskButton } from "./TaskButton";
import { TaskModal } from "./TaskModal";

interface TaskViewProps {
  data: Task;
}

const TaskView = React.forwardRef<HTMLDivElement, TaskViewProps>(
  (props, ref) => {
    const [viewModal, setViewModal] = React.useState(false);

    const handleCheck = React.useCallback(() => {
      if (!props.data.completed) {
        ipc.completeTask(props.data.id).then(() => toast("Task completed"));
      } else {
        ipc
          .uncompleteTask(props.data.id)
          .then(() => toast("Task completion reverted"));
      }
    }, [props.data]);

    return (
      <>
        <motion.div
          ref={ref}
          layout
          transition={{ duration: 0.3, type: "spring" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div
            className="p-0 bg-base/5 hover:bg-base/10 border border-base/5 hover:border-primary/40 cursor-pointer"
            onClick={(e) => {
              // @ts-ignore
              if (e.target.closest("button")) return;
              setViewModal(true);
            }}
            data-tauri-disable-drag
          >
            <div className="flex flex-row items-center gap-0.5">
              <TaskButton
                completed={props.data.completed}
                onValueChange={() => handleCheck()}
              />
              <div style={{ wordBreak: "break-all" }}>{props.data.body}</div>
            </div>
          </div>
        </motion.div>

        <TaskModal
          data={props.data}
          display={viewModal}
          onExit={() => setViewModal(false)}
        />
      </>
    );
  }
);

export default TaskView;
