import React from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Tooltip } from "@mantine/core";
import { motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { useConfirmDelete, useEvents } from "@/hooks";
import { Button } from "@/components";
import CreateTask from "./CreateTask";
import TaskView from "./TaskView";

const TasksView: React.FC = () => {
  const [viewCompletedTasks, setViewCompletedTasks] = React.useState(false);
  const [selectedTasksIds, setSelectedTasksIds] = React.useState<string[]>([]);

  const store = useStore();
  const tasksContainer = React.useRef<HTMLDivElement>(null);

  useEvents({
    task_created: (data) => {
      store.addTask(data);
      tasksContainer.current?.scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
    },
    task_updated: (data) => store.patchTask(data.id, data),
    task_deleted: (data) => store.removeTask(data.id),
    tasks_deleted: (data) => data.forEach((d) => store.removeTask(d.id)),
  });

  React.useEffect(() => {
    ipc.getTasks().then((data) => store.setTasks(data));
  }, []);

  var tasks = useStore((state) => state.tasks);
  tasks = tasks.filter((task) => task.intent_id === store.currentIntent?.id);

  return (
    <motion.div
      className="grow flex flex-col gap-0.5"
      transition={{ duration: 0.3 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1.0, opacity: 1 }}
    >
      <Top
        viewCompletedTasks={viewCompletedTasks}
        setViewCompletedTasks={setViewCompletedTasks}
        selectedTasksIds={selectedTasksIds}
        setSelectedTasksIds={setSelectedTasksIds}
      />

      <div className="grow flex flex-col window p-1.5">
        <div className="grow flex flex-col overflow-y-auto gap-1 pb-2">
          <div
            ref={tasksContainer}
            className="w-full max-h-0 flex flex-col gap-1"
          >
            {tasks.map((task) => {
              if (task.done === viewCompletedTasks) {
                let isSelected = selectedTasksIds.includes(task.id);

                return (
                  <TaskView
                    key={task.id}
                    data={task}
                    isSelected={isSelected}
                    onMouseDown={(e) => {
                      if (e.ctrlKey) {
                        if (isSelected) {
                          setSelectedTasksIds((ids) =>
                            ids.filter((id) => id !== task.id)
                          );
                        } else {
                          setSelectedTasksIds((ids) => [task.id, ...ids]);
                        }
                        return;
                      }

                      setSelectedTasksIds([]);
                    }}
                    onContextMenu={() => setSelectedTasksIds([])}
                  />
                );
              }
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

interface TopProps {
  viewCompletedTasks: boolean;
  setViewCompletedTasks: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTasksIds: string[];
  setSelectedTasksIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const Top: React.FC<TopProps> = (props) => {
  const [viewCreate, setViewCreate] = React.useState(false);

  return (
    <div className="flex flex-row gap-0.5">
      <CreateTask viewCreate={viewCreate} setViewCreate={setViewCreate} />

      {/* Toggle finished tasks */}
      {!viewCreate && (
        <ToggleTasksView
          viewCompleted={props.viewCompletedTasks}
          toggleTasks={() => props.setViewCompletedTasks((view) => !view)}
        />
      )}

      {!viewCreate && props.selectedTasksIds.length > 0 && (
        <DeleteMultiTasksButton
          selectedTasksIds={props.selectedTasksIds}
          setSelectedTasksIds={props.setSelectedTasksIds}
        />
      )}
    </div>
  );
};

interface ToggleTasksViewProps {
  viewCompleted: boolean;
  toggleTasks: () => void;
}

const ToggleTasksView: React.FC<ToggleTasksViewProps> = (props) => {
  return (
    <Tooltip label={props.viewCompleted ? "View incomplete" : "View completed"}>
      <div className="window">
        <Button onClick={() => props.toggleTasks()} transparent>
          {props.viewCompleted ? (
            <MdCheckBox size={24} />
          ) : (
            <MdCheckBoxOutlineBlank size={24} />
          )}
        </Button>
      </div>
    </Tooltip>
  );
};

interface DeleteMultiTasksButtonProps {
  selectedTasksIds: string[];
  setSelectedTasksIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const DeleteMultiTasksButton: React.FC<DeleteMultiTasksButtonProps> = (
  props
) => {
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteTasks(props.selectedTasksIds).then(() => {
      props.setSelectedTasksIds([]);
      toast("Tasks deleted");
    })
  );

  return (
    <div className="window">
      <Button onClick={() => onDelete()} transparent color="danger">
        {!viewConfirmDelete && <MdDelete size={20} />}
        <div>
          {viewConfirmDelete ? "Confirm" : props.selectedTasksIds.length}
        </div>
      </Button>
    </div>
  );
};

export default TasksView;
