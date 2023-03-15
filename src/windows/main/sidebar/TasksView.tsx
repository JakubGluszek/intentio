import React from "react";
import {
  MdAddCircle,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdDelete,
} from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { clsx, Tooltip } from "@mantine/core";
import { motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { useContextMenu, useEvents } from "@/hooks";
import { Button, ContextMenu } from "@/components";
import { Task } from "@/bindings/Task";

const TasksView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewCompletedTasks, setViewCompletedTasks] = React.useState(false);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const store = useStore();
  const tasksContainer = React.useRef<HTMLDivElement>(null);

  var tasks = useStore((state) => state.tasks);
  tasks = tasks.filter((task) => task.intent_id === store.currentIntent?.id);

  useEvents({
    task_created: (data) => {
      store.addTask(data);
      tasksContainer.current?.scrollIntoView({ block: "start" });
    },
    task_updated: (data) => store.patchTask(data.id, data),
    task_deleted: (data) => store.removeTask(data.id),
    tasks_deleted: (data) => data.forEach((d) => store.removeTask(d.id)),
  });

  React.useEffect(() => {
    ipc.getTasks().then((data) => store.setTasks(data));
  }, []);

  React.useEffect(() => {
    let hideConfirm: NodeJS.Timeout | undefined;
    if (viewConfirmDelete) {
      hideConfirm = setTimeout(() => {
        setViewConfirmDelete(false);
      }, 3000);
    } else {
      hideConfirm && clearTimeout(hideConfirm);
    }

    return () => hideConfirm && clearTimeout(hideConfirm);
  }, [viewConfirmDelete]);

  return (
    <div className="grow flex flex-col gap-0.5">
      <motion.div
        className="flex flex-row gap-0.5"
        transition={{ delay: 0.1, duration: 0.3 }}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 36 }}
      >
        <CreateTaskView viewCreate={viewCreate} setViewCreate={setViewCreate} />

        {!viewCreate && selectedIds.length > 0 ? (
          <div className="bg-window/90 border-2 border-base/80 rounded">
            {!viewConfirmDelete ? (
              <Button
                onClick={() => setViewConfirmDelete(true)}
                transparent
                color="danger"
              >
                <MdDelete size={20} />
                <div>{selectedIds.length}</div>
              </Button>
            ) : (
              <Button
                onClick={() =>
                  ipc.deleteTasks(selectedIds).then(() => {
                    setSelectedIds([]);
                    setViewConfirmDelete(false);
                    toast("Tasks deleted");
                  })
                }
                transparent
                color="danger"
              >
                <span>Confirm</span>
              </Button>
            )}
          </div>
        ) : null}

        {/* Toggle finished tasks */}
        {!viewCreate ? (
          <ToggleTasksView
            viewCompleted={viewCompletedTasks}
            toggleTasks={() => setViewCompletedTasks((view) => !view)}
          />
        ) : null}
      </motion.div>

      <div className="grow flex flex-col bg-window/90 border-2 border-base/80 rounded p-1.5">
        <div className="grow flex flex-col overflow-y-auto gap-1 pb-2">
          <div
            ref={tasksContainer}
            className="w-full max-h-0 flex flex-col gap-1"
          >
            {tasks.map((task) =>
              task.done === viewCompletedTasks ? (
                <TaskView
                  selectedTasksIds={selectedIds}
                  setSelectedTasksIds={setSelectedIds}
                  key={task.id}
                  data={task}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface CreateTaskViewProps {
  viewCreate: boolean;
  setViewCreate: (view: boolean) => void;
}

const CreateTaskView: React.FC<CreateTaskViewProps> = (props) => {
  const store = useStore();
  const { register, handleSubmit, setValue } = useForm<{ body: string }>();
  const ref = useClickOutside(() => props.setViewCreate(false));

  const onSubmit = handleSubmit((data) => {
    if (!store.currentIntent) return;
    ipc
      .createTask({ ...data, intent_id: store.currentIntent?.id })
      .then(() => {
        toast("Task created");
        props.setViewCreate(false);
        setValue("body", "");
      })
      .catch((err) => console.log("ipc.createTask", err));
  });

  if (!props.viewCreate)
    return (
      <div className="w-full bg-window/90 border-2 border-base/80 rounded">
        <Button
          onClick={() => props.setViewCreate(true)}
          style={{ width: "100%" }}
          transparent
          transition={{ delay: 0.2, duration: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <MdAddCircle size={20} />
          <div>Add task</div>
        </Button>
      </div>
    );

  return (
    <form
      ref={ref}
      onSubmit={onSubmit}
      className="w-full animate-in fade-in-0 zoom-in-90"
    >
      <input
        tabIndex={-3}
        {...register("body")}
        className="input bg-window/90"
        onKeyDown={(e) => {
          if (e.key !== "Escape") return;
          props.setViewCreate(false);
          setValue("body", "");
        }}
        placeholder="Describe your task"
        autoFocus
        minLength={1}
        autoComplete="off"
        maxLength={96}
      />
    </form>
  );
};

interface TaskViewProps {
  data: Task;
  selectedTasksIds: string[];
  setSelectedTasksIds?: React.Dispatch<React.SetStateAction<string[]>>;
}

const TaskView: React.FC<TaskViewProps> = (props) => {
  const { data } = props;

  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  const { viewMenu, setViewMenu, onContextMenuHandler } = useContextMenu();

  const { register, handleSubmit, setValue } = useForm<{ body: string }>();

  const containerRef = useClickOutside<HTMLDivElement>(() => {
    viewEdit && setViewEdit(false);
  });

  const isSelected = props.selectedTasksIds.includes(props.data.id);

  const onEditSubmit = handleSubmit((obj) => {
    ipc.updateTask(data.id, obj).then(() => {
      setViewEdit(false);
      toast("Task updated");
    });
  });

  const handleCheck = () =>
    ipc.updateTask(data.id, { done: !data.done }).then((task) => {
      const icon = ["🎉", "🎊", "😁", "😀", "🥳", "💪", "✅"][
        Math.floor(Math.random() * 7)
      ];

      task.done &&
        toast(`${icon} Task completed ${icon}`, {
          style: { whiteSpace: "nowrap" },
        });
    });

  React.useEffect(() => {
    let hideConfirm: NodeJS.Timeout | undefined;
    if (viewConfirmDelete) {
      hideConfirm = setTimeout(() => {
        setViewConfirmDelete(false);
      }, 3000);
    } else {
      hideConfirm && clearTimeout(hideConfirm);
    }

    return () => hideConfirm && clearTimeout(hideConfirm);
  }, [viewConfirmDelete]);

  return (
    <>
      <div
        ref={containerRef}
        className={clsx(
          "min-h-fit flex flex-col gap-1.5 card border-transparent text-sm p-0 bg-base/80 hover:bg-base rounded-sm",
          isSelected && "border-2 border-primary/50 hover:border-primary/60",
          viewEdit && "border-0"
        )}
        onMouseDown={(e) => {
          // @ts-ignore
          if (e.target.closest("button") || e.button === 2) return;

          if (e.ctrlKey) {
            if (isSelected) {
              props.setSelectedTasksIds &&
                props.setSelectedTasksIds((ids) =>
                  ids.filter((id) => id !== data.id)
                );
            } else {
              props.setSelectedTasksIds &&
                props.setSelectedTasksIds((ids) => [data.id, ...ids]);
            }
            return;
          }

          props.setSelectedTasksIds && props.setSelectedTasksIds([]);
        }}
        onContextMenu={(e) => {
          if (viewEdit) return;

          onContextMenuHandler(e);

          props.setSelectedTasksIds && props.setSelectedTasksIds([]);
        }}
        onDoubleClick={() => setViewEdit(true)}
        data-tauri-disable-drag
      >
        {!viewEdit ? (
          <div className="flex flex-row items-center gap-1">
            <Button
              onMouseDown={() => handleCheck()}
              style={{ padding: 2 }}
              transparent
            >
              {!data.done ? (
                <MdCheckBoxOutlineBlank size={24} />
              ) : (
                <MdCheckBox size={24} />
              )}
            </Button>
            <div style={{ wordBreak: "break-all" }}>{data.body}</div>
          </div>
        ) : (
          <form onSubmit={onEditSubmit}>
            <input
              className="input"
              {...register("body")}
              onBlur={() => {
                setViewEdit(false);
              }}
              onKeyDown={(e) => {
                if (e.key !== "Escape") return;
                setViewEdit(false);
                setValue("body", data.body);
              }}
              defaultValue={data.body}
              autoFocus
              autoComplete="off"
              maxLength={96}
              minLength={1}
            />
          </form>
        )}
      </div>
      {viewMenu ? (
        <TaskContextMenu
          data={data}
          leftPosition={viewMenu.leftPosition}
          topPosition={viewMenu.topPosition}
          hide={() => setViewMenu(undefined)}
          setViewEdit={() => setViewEdit(true)}
        />
      ) : null}
    </>
  );
};

interface TaskContextMenuProps {
  data: Task;
  leftPosition: number;
  topPosition: number;
  hide: () => void;
  setViewEdit: () => void;
}

const TaskContextMenu: React.FC<TaskContextMenuProps> = (props) => {
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    let hideConfirm: NodeJS.Timeout | undefined;
    if (viewConfirmDelete) {
      hideConfirm = setTimeout(() => {
        setViewConfirmDelete(false);
      }, 3000);
    } else {
      hideConfirm && clearTimeout(hideConfirm);
    }

    return () => hideConfirm && clearTimeout(hideConfirm);
  }, [viewConfirmDelete]);

  return (
    <ContextMenu
      hide={() => props.hide()}
      leftPosition={props.leftPosition}
      topPosition={props.topPosition}
    >
      <React.Fragment>
        {!viewConfirmDelete ? (
          <Button
            onClick={() => setViewConfirmDelete(true)}
            rounded={false}
            color="danger"
          >
            <MdDelete size={20} />
            <div className="w-full">Delete</div>
          </Button>
        ) : (
          <Button
            onClick={() =>
              ipc.deleteTask(props.data.id).then(() => toast("Task deleted"))
            }
            rounded={false}
            color="danger"
          >
            Confirm
          </Button>
        )}
      </React.Fragment>
    </ContextMenu>
  );
};

interface ToggleTasksViewProps {
  viewCompleted: boolean;
  toggleTasks: () => void;
}

const ToggleTasksView: React.FC<ToggleTasksViewProps> = (props) => {
  return (
    <Tooltip label={props.viewCompleted ? "View incomplete" : "View completed"}>
      <div className="bg-window/90 border-2 border-base/80 rounded">
        <Button
          onClick={() => props.toggleTasks()}
          transparent
          transition={{ delay: 0.2, duration: 0.3 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
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

export default TasksView;
