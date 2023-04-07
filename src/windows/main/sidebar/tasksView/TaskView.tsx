import React from "react";
import { MdCheckBox, MdCheckBoxOutlineBlank, MdDelete } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { clsx } from "@mantine/core";

import ipc from "@/ipc";
import { useConfirmDelete, useContextMenu } from "@/hooks";
import { Button, ContextMenu } from "@/components";
import { Task } from "@/bindings/Task";
import { MenuPosition } from "@/hooks/useContextMenu";

interface TaskViewProps {
  data: Task;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onContextMenu: () => void;
}

const TaskView: React.FC<TaskViewProps> = (props) => {
  const { data } = props;

  const [viewEdit, setViewEdit] = React.useState(false);

  const [menu, onContextMenuHandler] = useContextMenu();
  const { register, handleSubmit, setValue } = useForm<{ body: string }>();

  const containerRef = useClickOutside<HTMLDivElement>(() => {
    viewEdit && setViewEdit(false);
  });

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

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        className={clsx(
          "min-h-fit flex flex-col gap-1.5 card border-transparent text-sm p-0 bg-base/80 hover:bg-base rounded-sm",
          props.isSelected &&
          "border-2 border-primary/50 hover:border-primary/60",
          viewEdit && "border-0"
        )}
        onMouseDown={(e) => {
          // @ts-ignore
          if (e.target.closest("button") || e.button === 2) return;
          props.onMouseDown(e);
        }}
        onContextMenu={(e) => {
          if (viewEdit) return;
          onContextMenuHandler(e);
          props.onContextMenu();
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
              onKeyDown={(e) => {
                if (e.key !== "Escape") return;
                setViewEdit(false);
                setValue("body", data.body);
              }}
              defaultValue={data.body}
              autoFocus
              autoComplete="off"
              minLength={1}
              maxLength={96}
              {...register("body", { onBlur: () => setViewEdit(false) })}
            />
          </form>
        )}
      </div>
      <TaskContextMenu
        {...menu}
        data={data}
        setViewEdit={() => setViewEdit(true)}
      />
    </React.Fragment>
  );
};

interface TaskContextMenuProps {
  display: boolean;
  data: Task;
  position?: MenuPosition;
  hide: () => void;
  setViewEdit: () => void;
}

const TaskContextMenu: React.FC<TaskContextMenuProps> = (props) => {
  const { viewConfirmDelete, onDelete } = useConfirmDelete(() =>
    ipc.deleteTask(props.data.id).then(() => toast("Task deleted"))
  );

  return (
    <ContextMenu
      display={props.display}
      position={props.position}
      hide={() => props.hide()}
    >
      <React.Fragment>
        <Button onClick={() => onDelete()} rounded={false} color="danger">
          <div className="w-fit">
            <MdDelete size={20} />
          </div>
          <div className="w-full">
            {viewConfirmDelete ? "Confirm" : "Delete"}
          </div>
        </Button>
      </React.Fragment>
    </ContextMenu>
  );
};

export default TaskView;
