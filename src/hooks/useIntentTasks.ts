import React from "react";

import ipc from "@/ipc";
import { Task } from "@/bindings/Task";
import { UpdateTask } from "@/bindings/UpdateTask";

import useEvents from "./useEvents";

export const useIntentTasks = (intentId: number, completed: boolean) => {
  const [data, setData] = React.useState<Task[]>([]);

  const getList = async () => {
    const result = await ipc.getTasks({
      intent_id: intentId,
      completed,
      limit: null,
      offset: null,
    });
    setData(result);
    return result;
  };
  const create = async (data: { body: string }) => {
    return await ipc.createTask({ ...data, intent_id: intentId });
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

  useEvents({
    task_updated: () => getList(),
    task_created: () => getList(),
    task_deleted: () => getList(),
    task_completed: () => getList(),
    task_uncompleted: () => getList(),
  });

  React.useEffect(() => {
    getList();
  }, [completed]);

  return { data, getList, create, update, complete, uncomplete };
};
