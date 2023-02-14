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
import { createPortal } from "react-dom";
import { clsx } from "@mantine/core";

import useStore from "@/store";
import ipc from "@/ipc";
import { useEvent } from "@/hooks";
import { Button } from "@/components";
import { Task } from "@/bindings/Task";
import config from "@/config";

const TasksView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewFinished, setViewFinished] = React.useState(false);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  const store = useStore();
  const containerRef = React.useRef<HTMLDivElement>(null);

  var tasks = useStore((state) => state.tasks);
  tasks = tasks.filter((task) => task.intent_id === store.activeIntentId);

  useEvent("task_created", (event) => {
    store.addTask(event.payload);
    containerRef.current?.scrollIntoView({ block: "start" });
  });
  useEvent("task_updated", (event) =>
    store.patchTask(event.payload.id, event.payload)
  );
  useEvent("task_deleted", (event) => store.removeTask(event.payload.id));
  useEvent("tasks_deleted", (event) =>
    event.payload.forEach((data) => store.removeTask(data.id))
  );

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
    <div className="grow flex flex-col overflow-y-auto pt-2 gap-1">
      <div className="flex flex-row items-center justify-between">
        <CreateTaskView viewCreate={viewCreate} setViewCreate={setViewCreate} />
        {!viewCreate && selectedIds.length > 0 ? (
          <>
            {!viewConfirmDelete ? (
              <Button
                // @ts-ignore
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
                Confirm
              </Button>
            )}
          </>
        ) : null}
      </div>

      {tasks.length > 0 ? (
        <div className="grow flex flex-col overflow-y-auto gap-1">
          <div
            ref={containerRef}
            className="w-full max-h-0 flex flex-col gap-1 pb-0.5"
          >
            {/* Tasks yet unfinished */}
            {tasks.map((task) =>
              !task.done ? (
                <TaskView
                  selectedTasksIds={selectedIds}
                  setSelectedTasksIds={setSelectedIds}
                  key={task.id}
                  data={task}
                />
              ) : null
            )}

            {/* View finished tasks button */}
            {tasks.filter((task) => task.done).length > 0 ? (
              <button
                onMouseDown={() => setViewFinished((prev) => !prev)}
                className="font-mono w-fit mx-auto text-sm text-text/60 hover:text-primary my-1"
              >
                {viewFinished ? "Hide" : "View"} finished tasks (
                {tasks.filter((task) => task.done).length})
              </button>
            ) : null}

            {/* Finished tasks list */}
            {viewFinished
              ? tasks.map((task) =>
                task.done ? (
                  <TaskView
                    selectedTasksIds={selectedIds}
                    setSelectedTasksIds={setSelectedIds}
                    key={task.id}
                    data={task}
                  />
                ) : null
              )
              : null}
          </div>
        </div>
      ) : null}

      {/* Some text to fill out the empty space */}
      {tasks.length === 0 ? (
        <div className="flex flex-col gap-2 text-center m-auto text-text/50 text-sm">
          {
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
            ][Math.floor(Math.random() * 4)]
          }
        </div>
      ) : null}
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
    ipc
      .createTask({ ...data, intent_id: store.activeIntentId! })
      .then(() => {
        toast("Task created");
        props.setViewCreate(false);
        setValue("body", "");
      })
      .catch((err) => console.log("ipc.createTask", err));
  });

  return (
    <div className="h-8 w-full">
      {!props.viewCreate ? (
        <Button transparent onClick={() => props.setViewCreate(true)}>
          <MdAddCircle size={20} />
          <span>Add task</span>
        </Button>
      ) : (
        <form ref={ref} onSubmit={onSubmit}>
          <input
            tabIndex={-3}
            {...register("body")}
            className="input h-8"
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              props.setViewCreate(false);
              setValue("body", "");
            }}
            autoFocus
            minLength={1}
            autoComplete="off"
            maxLength={96}
          />
        </form>
      )}
    </div>
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
  const [viewModal, setViewModal] = React.useState<{ x: number; y: number }>();
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  const { register, handleSubmit, setValue } = useForm<{ body: string }>();
  const containerRef = useClickOutside<HTMLDivElement>(() => {
    viewEdit && setViewEdit(false);
  });
  const store = useStore();

  const modalWidth = 120;
  const modalHeight = 32;

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

  // fixes clicking outside where there is no `data-tauri-disable-drag property`
  // otherwise context would not close because the window would start being dragged
  React.useEffect(() => {
    if (viewModal) {
      store.setTauriDragEnabled(false);
    } else {
      store.setTauriDragEnabled(true);
    }
  }, [viewModal]);

  return (
    <>
      <div
        ref={containerRef}
        className={clsx(
          "min-h-fit flex flex-col gap-1.5 p-1 rounded shadow text-sm",
          isSelected
            ? "bg-base/80 hover:bg-base"
            : "bg-window/80 hover:bg-window"
        )}
        onMouseDown={(e) => {
          // @ts-ignore
          if (e.target.closest("button") || e.button === 2 || viewModal) return;

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
          var x = e.pageX;
          var y = e.pageY;

          const root = config.webviews.main;
          const padding = 8;

          // fix possible x overflow
          if (x + modalWidth > root.width) {
            x = x - (x + modalWidth - root.width) - padding;
          }

          // fix possible y overflow
          if (y + modalHeight > root.height) {
            y = y - (y + modalHeight - root.height) - padding;
          }

          props.setSelectedTasksIds && props.setSelectedTasksIds([]);
          setViewModal({ x, y });
        }}
        onDoubleClick={() => setViewEdit(true)}
        data-tauri-disable-drag
      >
        {!viewEdit ? (
          <div className="flex flex-row items-start gap-1">
            {!data.done ? (
              <Button onMouseDown={() => handleCheck()} transparent>
                <MdCheckBoxOutlineBlank size={24} />
              </Button>
            ) : (
              <Button onMouseDown={() => handleCheck()} transparent>
                <MdCheckBox size={24} />
              </Button>
            )}
            <div className="mt-0.5" style={{ wordBreak: "break-all" }}>
              {data.body}
            </div>
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
      {viewModal
        ? createPortal(
          <TaskModal
            data={data}
            x={viewModal.x}
            y={viewModal.y}
            width={modalWidth}
            height={modalHeight}
            hide={() => setViewModal(undefined)}
            setViewEdit={() => setViewEdit(true)}
          />,
          document.getElementById("root")!
        )
        : null}
    </>
  );
};

interface TaskModalProps {
  data: Task;
  x: number;
  y: number;
  width: number;
  height: number;
  hide: () => void;
  setViewEdit: () => void;
}

const TaskModal: React.FC<TaskModalProps> = (props) => {
  const [preventHide, setPreventHide] = React.useState(true);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  const deleteRef = React.useRef<HTMLButtonElement>(null);

  const ref = useClickOutside<HTMLDivElement>(
    () => !preventHide && props.hide(),
    ["click", "contextmenu"],
    [deleteRef.current]
  );

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

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setPreventHide(false);
    }, 20);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        zIndex: 9999,
        position: "fixed",
        left: props.x,
        top: props.y,
        width: props.width,
        height: props.height,
      }}
      className="bg-base rounded shadow-lg text-sm p-0.5"
    >
      <div className="flex flex-col gap-0.5 overflow-clip rounded">
        {!viewConfirmDelete ? (
          <Button
            innerRef={deleteRef}
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
      </div>
    </div>
  );
};

export default TasksView;
