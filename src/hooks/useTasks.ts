import React from "react";

import ipc from "@/ipc";
import { Task } from "@/bindings/Task";
import { CreateTask } from "@/bindings/CreateTask";
import { UpdateTask } from "@/bindings/UpdateTask";
import { GetTasksOptions } from "@/bindings/GetTasksOptions";

export const useTasks = () => {
  const [data, setData] = React.useState<Task[]>([]);

  const getList = async (options: GetTasksOptions) => {
    return await ipc.getTasks(options);
  };
  const create = async (data: CreateTask) => {
    return await ipc.createTask(data);
  };
  const update = async (id: number, data: Partial<UpdateTask>) => {
    return await ipc.updateTask(id, data);
  };
  const complete = async (id: number) => {
    return await ipc.completeTask(id);
  };
  const uncomplete = async (id: number) => {
    return await ipc.uncompleteTask(id);
  };

  return { data, getList, create, update, complete, uncomplete };
};
