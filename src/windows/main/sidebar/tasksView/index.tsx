import React from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete } from "react-icons/md";
import { toast } from "react-hot-toast";
import { Tooltip } from "@mantine/core";
import { motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { useConfirmDelete, useEvents } from "@/hooks";
import { Button } from "@/components";
import motions from "@/motions";
import { Task } from "@/bindings/Task";
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
    <div className="grow flex flex-col gap-0.5">
      <Top
        viewCompletedTasks={viewCompletedTasks}
        setViewCompletedTasks={setViewCompletedTasks}
        selectedTasksIds={selectedTasksIds}
        setSelectedTasksIds={setSelectedTasksIds}
      />
      <TasksList
        innerRef={tasksContainer}
        tasks={tasks}
        viewCompletedTasks={viewCompletedTasks}
        selectedTasksIds={selectedTasksIds}
        setSelectedTasksIds={setSelectedTasksIds}
      />
    </div>
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

interface TasksListProps {
  innerRef: React.RefObject<HTMLDivElement>;
  tasks: Task[];
  viewCompletedTasks: boolean;
  selectedTasksIds: string[];
  setSelectedTasksIds: React.Dispatch<React.SetStateAction<string[]>>;
}

const TasksList: React.FC<TasksListProps> = (props) => {
  const emptyFiller = React.useMemo(
    () =>
      [
        <>
          <p>No tasks?</p>
          <p>That's like going on a road trip without a map.</p>
          <p>Add one now!</p>
        </>,
        <>
          <p>Your task list is empty, it's like a ghost town.</p>
          <p>Let's liven it up!</p>
        </>,
        <>
          <p>Don't let your tasks disappear into thin air.</p>
          <p>Add some now!</p>
        </>,
        <>
          <p>Break it down.</p>
          <p>Complete.</p>
          <p>Repeat.</p>
        </>,
      ][Math.floor(Math.random() * 4)],
    []
  );

  if (props.tasks.length === 0) {
    return (
      <motion.div
        className="grow flex flex-col items-center justify-center text-center text-sm text-text/40 gap-2 p-1.5 window"
        {...motions.scaleIn}
      >
        {emptyFiller}
      </motion.div>
    );
  }
  return (
    <motion.div
      className="grow flex flex-col window p-1.5"
      {...motions.scaleIn}
    >
      <div className="grow flex flex-col overflow-y-auto gap-1 pb-2">
        <div
          ref={props.innerRef}
          className="w-full max-h-0 flex flex-col gap-1"
        >
          {props.tasks.map((task) => {
            if (task.done === props.viewCompletedTasks) {
              let isSelected = props.selectedTasksIds.includes(task.id);

              return (
                <TaskView
                  key={task.id}
                  data={task}
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
            }
          })}
        </div>
      </div>
    </motion.div>
  );
};

interface ToggleTasksViewProps {
  viewCompleted: boolean;
  toggleTasks: () => void;
}

const ToggleTasksView: React.FC<ToggleTasksViewProps> = (props) => {
  return (
    <Tooltip label={props.viewCompleted ? "View incomplete" : "View completed"}>
      <motion.div className="window" {...motions.scaleIn}>
        <Button onClick={() => props.toggleTasks()} transparent>
          {props.viewCompleted ? (
            <MdCheckBox size={24} />
          ) : (
            <MdCheckBoxOutlineBlank size={24} />
          )}
        </Button>
      </motion.div>
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
    <motion.div className="window" {...motions.scaleIn}>
      <Button onClick={() => onDelete()} transparent color="danger">
        {!viewConfirmDelete && <MdDelete size={20} />}
        <div>
          {viewConfirmDelete ? "Confirm" : props.selectedTasksIds.length}
        </div>
      </Button>
    </motion.div>
  );
};

export default TasksView;
