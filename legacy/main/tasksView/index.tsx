import React from "react";
import { MdDelete } from "react-icons/md";
import { AnimatePresence } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { DangerButton, Tooltip } from "@/ui";
import { useConfirmDelete, useEvents } from "@/hooks";
import { ModelId } from "@/types";
import { Task } from "@/bindings/Task";

import CreateTask from "./CreateTask";
import TaskView from "./TaskView";
import { PanelView, PanelViewProps } from "../PanelView";
import { TaskButton } from "./TaskButton";
import { toast } from "react-hot-toast";

const TasksView: React.FC<PanelViewProps> = (props) => {
  const [viewCompletedTasks, setViewCompletedTasks] = React.useState(false);
  const [selectedTasksIds, setSelectedTasksIds] = React.useState<ModelId[]>([]);
  const [viewCreate, setViewCreate] = React.useState(false);

  const store = useStore();
  const tasksContainer = React.useRef<HTMLDivElement>(null);

  useEvents({
    task_created: ({ data: id }) => {
      ipc.getTask(id).then((data) => {
        store.addTask(data);
        tasksContainer.current?.scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
      });
    },
    task_updated: ({ data: id }) =>
      ipc.getTask(id).then((data) => store.patchTask(id, data)),
    task_deleted: ({ data: id }) => store.removeTask(id),
  });

  React.useEffect(() => {
    ipc.getTasks().then((data) => store.setTasks(data));
  }, []);

  var tasks = useStore((state) => state.tasks);
  tasks = tasks.filter((task) => task.intent_id === store.currentIntent?.id);

  return (
    <PanelView {...props}>
      <div className="grow flex flex-col gap-1 p-0.5">
        <div className="flex flex-row items-center justify-between gap-1">
          <CreateTask viewCreate={viewCreate} setViewCreate={setViewCreate} />

          {!viewCreate && (
            <div className="flex flex-row items-center gap-1">
              {selectedTasksIds.length > 0 && (
                <DeleteMultiTasksButton
                  selectedTasksIds={selectedTasksIds}
                  setSelectedTasksIds={setSelectedTasksIds}
                />
              )}

              <ToggleTasksView
                viewCompleted={viewCompletedTasks}
                toggleTasks={() => setViewCompletedTasks((view) => !view)}
              />
            </div>
          )}
        </div>

        <TasksList
          innerRef={tasksContainer}
          tasks={tasks}
          viewCompletedTasks={viewCompletedTasks}
          selectedTasksIds={selectedTasksIds}
          setSelectedTasksIds={setSelectedTasksIds}
        />
      </div>
    </PanelView>
  );
};

interface TasksListProps {
  innerRef: React.RefObject<HTMLDivElement>;
  tasks: Task[];
  viewCompletedTasks: boolean;
  selectedTasksIds: ModelId[];
  setSelectedTasksIds: React.Dispatch<React.SetStateAction<ModelId[]>>;
}

const TasksList: React.FC<TasksListProps> = (props) => {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className="grow flex flex-col overflow-y-auto">
      <div ref={props.innerRef} className="max-h-0 overflow-y">
        <div className="flex flex-col gap-1">
          <AnimatePresence
            key={props.viewCompletedTasks ? 1 : 0}
            mode="popLayout"
          >
            {props.tasks
              .filter((task) => task.completed === props.viewCompletedTasks)
              .map((task) => {
                let isSelected = props.selectedTasksIds.includes(task.id);

                return (
                  <TaskView
                    data={task}
                    ref={ref}
                    key={task.id}
                    isSelected={isSelected}
                    onMouseDown={(e) => {
                      if (e.ctrlKey) {
                        if (isSelected) {
                          props.setSelectedTasksIds((ids) =>
                            ids.filter((id) => id !== task.id)
                          );
                        } else {
                          props.setSelectedTasksIds((ids) => [task.id, ...ids]);
                        }
                        return;
                      }

                      props.setSelectedTasksIds([]);
                    }}
                    onContextMenu={() => props.setSelectedTasksIds([])}
                  />
                );
              })}
          </AnimatePresence>
        </div>
      </div>
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
      <TaskButton
        completed={props.viewCompleted}
        onValueChange={() => props.toggleTasks()}
      />
    </Tooltip>
  );
};

interface DeleteMultiTasksButtonProps {
  selectedTasksIds: ModelId[];
  setSelectedTasksIds: React.Dispatch<React.SetStateAction<ModelId[]>>;
}

const DeleteMultiTasksButton: React.FC<DeleteMultiTasksButtonProps> = (
  props
) => {
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    toast("feature corrupted")
  );

  return (
    <DangerButton variant="ghost" onClick={() => onDelete()}>
      {!viewConfirmDelete && <MdDelete size={20} />}
      <div>{viewConfirmDelete ? "Confirm" : props.selectedTasksIds.length}</div>
    </DangerButton>
  );
};

export default TasksView;
