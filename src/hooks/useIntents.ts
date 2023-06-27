import React from "react";

import ipc from "@/ipc";
import { CreateIntent } from "@/bindings/CreateIntent";
import { UpdateIntent } from "@/bindings/UpdateIntent";
import { Intent } from "@/bindings/Intent";
import useEvents from "./useEvents";

export const useIntents = () => {
  const [data, setData] = React.useState<Intent[]>([]);

  const create = async (data: CreateIntent) => {
    return await ipc.createIntent(data);
  };
  const update = async (id: number, data: UpdateIntent) => {
    return await ipc.updateIntent(id, data);
  };
  const remove = async (id: number) => {
    return await ipc.deleteIntent(id);
  };
  const get = async (id: number) => {
    return await ipc.getIntent(id);
  };
  const getList = async () => {
    return await ipc.getIntents();
  };

  const onIntentUpdate = (id: number, data: Intent) =>
    setData((intents) => intents.map((i) => (i.id === id ? data : i)));

  React.useEffect(() => {
    getList().then((data) => setData(data));
  }, []);

  useEvents({
    intent_created: (id) =>
      get(id).then((data) => setData((intents) => [...intents, data])),
    intent_updated: (id) => get(id).then((data) => onIntentUpdate(id, data)),
    intent_deleted: (id) =>
      setData((intents) => intents.filter((i) => i.id !== id)),
    intent_archived: (id) => get(id).then((data) => onIntentUpdate(id, data)),
    intent_unarchived: (id) => get(id).then((data) => onIntentUpdate(id, data)),
  });

  return {
    data,
    create,
    update,
    remove,
    get,
    getList,
  };
};
