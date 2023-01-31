import React from "react";
import {
  MdAddCircle,
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdDelete,
  MdEdit,
} from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

import useStore from "@/store";
import services from "@/services";
import { useEvent } from "@/hooks";
import { Button } from "@/components";
import { Task } from "@/bindings/Task";

const TasksView: React.FC = () => {
  const [viewFinished, setViewFinished] = React.useState(false);

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

  React.useEffect(() => {
    services.getTasks().then((data) => store.setTasks(data));
  }, []);

  return (
    <div className="grow flex flex-col overflow-y-auto pt-2 gap-1">
      <CreateTaskView />

      {tasks.length > 0 ? (
        <div className="grow flex flex-col overflow-y-auto gap-1">
          <div
            ref={containerRef}
            className="w-full max-h-0 flex flex-col gap-1 pb-0.5"
          >
            {/* Tasks yet unfinished */}
            {tasks.map((task) =>
              !task.done ? <TaskView key={task.id} data={task} /> : null
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
                task.done ? <TaskView key={task.id} data={task} /> : null
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
            ][Math.floor(Math.random() * 3)]
          }
        </div>
      ) : null}
    </div>
  );
};

const CreateTaskView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);

  const store = useStore();
  const { register, handleSubmit, setValue } = useForm<{ body: string }>();
  const ref = useClickOutside(() => setViewCreate(false));

  const onSubmit = handleSubmit((data) => {
    services
      .createTask({ ...data, intent_id: store.activeIntentId! })
      .then(() => {
        toast("Task created");
        setViewCreate(false);
        setValue("body", "");
      })
      .catch((err) => console.log("services.createTask", err));
  });

  return (
    <div className="h-8">
      {!viewCreate ? (
        <Button onClick={() => setViewCreate(true)}>
          <MdAddCircle size={24} />
          <span>Add task</span>
        </Button>
      ) : (
        <form ref={ref} onSubmit={onSubmit}>
          <input
            {...register("body")}
            className="input h-8"
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              setViewCreate(false);
              setValue("body", "");
            }}
            autoFocus
            minLength={1}
            maxLength={96}
          />
        </form>
      )}
    </div>
  );
};

interface TaskViewProps {
  data: Task;
}

const TaskView: React.FC<TaskViewProps> = (props) => {
  const { data } = props;

  const [viewMore, setViewMore] = React.useState(false);
  const [viewEdit, setViewEdit] = React.useState(false);
  const [viewConfirmDelete, setViewConfirmDelete] = React.useState(false);

  const { register, handleSubmit, setValue } = useForm<{ body: string }>();
  const containerRef = useClickOutside<HTMLDivElement>(
    () => !viewEdit && setViewMore(false)
  );

  const onEditSubmit = handleSubmit((obj) => {
    services.updateTask(data.id, obj).then(() => {
      setViewEdit(false);
      toast("Task updated");
    });
  });

  const handleCheck = () =>
    services.updateTask(data.id, { done: !data.done }).then((task) => {
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
    <div
      ref={containerRef}
      className="min-h-fit flex flex-col gap-1.5 p-1 bg-window/80 hover:bg-window rounded shadow text-sm"
      onMouseDown={(e) => {
        // @ts-ignore
        !e.target.closest("button") && setViewMore((prev) => !prev);
        containerRef.current.scrollIntoView({
          block: "center",
        });
      }}
      data-tauri-disable-drag
    >
      {!viewEdit ? (
        <>
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
          {viewMore ? (
            <div className="flex flex-row items-center justify-end gap-0.5 h-5 rounded overflow-clip">
              <Button onClick={() => setViewEdit(true)} rounded={false}>
                <MdEdit size={16} />
                <span>Edit</span>
              </Button>
              {!viewConfirmDelete ? (
                <Button
                  onClick={() => setViewConfirmDelete(true)}
                  rounded={false}
                  color="danger"
                >
                  <MdDelete size={16} />
                  <span>Delete</span>
                </Button>
              ) : (
                <Button
                  onClick={() =>
                    services
                      .deleteTask(data.id)
                      .then(() => toast("Task deleted"))
                  }
                  rounded={false}
                  color="danger"
                >
                  Confirm
                </Button>
              )}
            </div>
          ) : null}
        </>
      ) : (
        <form onSubmit={onEditSubmit}>
          <input
            className="input"
            {...register("body")}
            onBlur={() => {
              setViewEdit(false);
              setViewMore(false);
            }}
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              setViewEdit(false);
              setValue("body", data.body);
            }}
            defaultValue={data.body}
            autoFocus
            maxLength={96}
            minLength={1}
          />
        </form>
      )}
    </div>
  );
};

export default TasksView;
