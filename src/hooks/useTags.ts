import React from "react";

import ipc from "@/ipc";
import { ModelId } from "@/types";
import { Tag } from "@/bindings/Tag";
import { CreateTag } from "@/bindings/CreateTag";
import { UpdateTag } from "@/bindings/UpdateTag";
import useEvents from "./useEvents";

export const useTags = () => {
  const [data, setData] = React.useState<Tag[]>([]);

  const create = async (data: CreateTag) => {
    return await ipc.createTag(data);
  };
  const update = async (id: ModelId, data: UpdateTag) => {
    return await ipc.updateTag(id, data);
  };
  const remove = async (id: ModelId) => {
    return await ipc.deleteTag(id);
  };
  const get = async (id: ModelId) => {
    return await ipc.getTag(id);
  };
  const getList = async () => {
    return await ipc.getTags();
  };

  React.useEffect(() => {
    getList().then((data) => setData(data));
  }, []);

  useEvents({
    tag_created: (id) => {
      ipc.getTag(id).then((data) => setData((tags) => [data, ...tags]));
    },
    tag_updated: (id) => {
      ipc
        .getTag(id)
        .then((data) =>
          setData((tags) => tags.map((tag) => (tag.id === id ? data : tag)))
        );
    },
    tag_deleted: (id) => setData((tags) => tags.filter((tag) => tag.id !== id)),
  });

  return { data, create, update, remove, get, getList };
};
