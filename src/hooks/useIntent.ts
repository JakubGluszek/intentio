import React from "react";

import ipc from "@/ipc";
import { ModelId } from "@/types";
import { UpdateIntent } from "@/bindings/UpdateIntent";
import { Intent } from "@/bindings/Intent";

import useEvents from "./useEvents";
import { Tag } from "@/bindings/Tag";
import { CreateIntentTag } from "@/bindings/CreateIntentTag";
import { DeleteIntentTag } from "@/bindings/DeleteIntentTag";

export const useIntent = (id: ModelId | null) => {
  const [intent, setIntent] = React.useState<Intent>();
  const [tags, setTags] = React.useState<Tag[]>([]);

  const getIntent = async (id: number) => {
    return await ipc.getIntent(id).then((data) => setIntent(data));
  };
  const getTags = async (id: ModelId) => {
    return await ipc.getIntentTags(id).then((data) => setTags(data));
  };

  const update = async (data: UpdateIntent) => {
    if (!id) return null;
    return await ipc.updateIntent(id, data);
  };
  const remove = async (id: ModelId) => {
    if (!id) return null;
    return await ipc.deleteIntent(id);
  };
  const addTag = async (data: CreateIntentTag) => {
    return await ipc.addIntentTag(data);
  };
  const removeTag = async (data: DeleteIntentTag) => {
    return await ipc.deleteIntentTag(data);
  };
  const archive = async () => {
    if (!intent) return;
    return await ipc.archiveIntent(intent.id);
  };
  const unarchive = async () => {
    if (!intent) return;
    return await ipc.unarchiveIntent(intent.id);
  };

  React.useEffect(() => {
    if (!id) return;
    getIntent(id);
    getTags(id);
  }, [id]);

  useEvents({
    intent_updated: (id) => intent?.id === id && getIntent(id),
    intent_archived: (id) => intent?.id === id && getIntent(id),
    intent_unarchived: (id) => intent?.id === id && getIntent(id),
    intent_deleted: (id) => intent?.id === id && setIntent(undefined),
    intent_tag_created: (data) => data.intent_id === id && getTags(id),
    intent_tag_deleted: (data) => data.intent_id === id && getTags(id),
    tag_deleted: (id) => tags.find((tag) => tag.id === id) && getTags(id),
  });

  return {
    data: intent,
    tags,
    update,
    remove,
    addTag,
    removeTag,
    archive,
    unarchive,
  } as const;
};
