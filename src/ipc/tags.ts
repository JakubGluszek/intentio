import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { CreateTag } from "@/bindings/CreateTag";
import { UpdateTag } from "@/bindings/UpdateTag";
import { Tag } from "@/bindings/Tag";

export const createTag = async (data: CreateTag) => {
  return await invoke<ModelId>("create_tag", { data });
};

export const updateTag = async (id: ModelId, data: UpdateTag) => {
  return await invoke<ModelId>("update_tag", { id, data });
};

export const deleteTag = async (id: ModelId) => {
  return await invoke<ModelId>("delete_tag", { id });
};

export const getTag = async (id: ModelId) => {
  return await invoke<Tag>("get_tag", { id });
};

export const getTags = async () => {
  return await invoke<Tag[]>("get_tags");
};
