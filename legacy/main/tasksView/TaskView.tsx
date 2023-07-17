import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { clsx } from "@mantine/core";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

import ipc from "@/ipc";
import { useConfirmDelete, useContextMenu } from "@/hooks";
import { Task } from "@/bindings/Task";
import { Button, Card, Input, ContextMenu, DangerButton } from "@/ui";
import { TaskButton } from "./TaskButton";

interface TaskViewProps {
  data: Task;
  isSelected: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  onContextMenu: () => void;
}

const TaskView = React.forwardRef<HTMLDivElement, TaskViewProps>(
  (props, ref) => {
    const [viewEdit, setViewEdit] = React.useState(false);

    const [menu, onContextMenuHandler] = useContextMenu();
    const { register, handleSubmit, setValue } = useForm<{ body: string }>();

    const containerRef = useClickOutside<HTMLDivElement>(() => {
      viewEdit && setViewEdit(false);
    });

    const { viewConfirmDelete, onDelete } = useConfirmDelete(() => {
      menu.hide();
      ipc.deleteTask(props.data.id).then(() => {
        toast("Task deleted");
      });
    });

    const onEditSubmit = handleSubmit((obj) => {
      ipc.updateTask(props.data.id, obj).then(() => {
        setViewEdit(false);
        toast("Task updated");
      });
    });

    const handleCheck = React.useCallback(() => {
      if (!props.data.completed) {
        ipc.completeTask(props.data.id).then(() => toast("Task completed"));
      } else {
        ipc
          .uncompleteTask(props.data.id)
          .then(() => toast("Task completion reverted"));
      }
    }, [props.data]);

    if (viewEdit)
      return (
        <form onSubmit={onEditSubmit}>
          <Input
            onKeyDown={(e) => {
              if (e.key !== "Escape") return;
              setViewEdit(false);
              setValue("body", props.data.body);
            }}
            defaultValue={props.data.body}
            autoFocus
            minLength={1}
            maxLength={96}
            {...register("body", { onBlur: () => setViewEdit(false) })}
          />
        </form>
      );

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
          <Card
            ref={containerRef}
            className={clsx(
              "p-0 hover:border-primary/50",
              menu.display && "border-primary/50"
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
            data-tauri-disable-drag
          >
            <div className="flex flex-row gap-0.5">
              <TaskButton
                completed={props.data.completed}
                onValueChange={() => handleCheck()}
              />
              <div className="pt-1" style={{ wordBreak: "break-all" }}>
                {props.data.body}
              </div>
            </div>
          </Card>
        </motion.div>

        <ContextMenu
          {...menu}
          className="border-2 h-fit bg-window border-transparent"
        >
          <Button
            onClick={() => {
              setViewEdit(true);
              menu.hide();
            }}
            variant="base"
            className="w-full"
          >
            <div className="w-fit">
              <MdEdit size={20} />
            </div>
            <div className="w-full">Edit</div>
          </Button>
          <DangerButton
            variant="base"
            onClick={() => onDelete()}
            className="w-full active:border-danger"
          >
            <div className="w-fit">
              <MdDelete size={20} />
            </div>
            <div className="w-full">
              {viewConfirmDelete ? "Confirm" : "Delete"}
            </div>
          </DangerButton>
        </ContextMenu>
      </>
    );
  }
);

export default TaskView;
