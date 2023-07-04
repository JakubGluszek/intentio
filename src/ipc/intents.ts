import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { Intent } from "@/bindings/Intent";
import { CreateIntent } from "@/bindings/CreateIntent";
import { UpdateIntent } from "@/bindings/UpdateIntent";
import { Tag } from "@/bindings/Tag";
import { CreateIntentTag } from "@/bindings/CreateIntentTag";
import { DeleteIntentTag } from "@/bindings/DeleteIntentTag";

export const createIntent = async (data: CreateIntent) => {
  return await invoke<ModelId>("create_intent", { data });
};

export const updateIntent = async (
  id: ModelId,
  data: Partial<UpdateIntent>
) => {
  return await invoke<ModelId>("update_intent", { id, data });
};

export const deleteIntent = async (id: ModelId) => {
  return await invoke<ModelId>("delete_intent", { id });
};

export const getIntent = async (id: ModelId) => {
  return await invoke<Intent>("get_intent", { id });
};

export const getIntents = async () => {
  return await invoke<Intent[]>("get_intents");
};

export const archiveIntent = async (id: ModelId) => {
  return await invoke<ModelId>("archive_intent", { id });
};

export const unarchiveIntent = async (id: ModelId) => {
  return await invoke<ModelId>("unarchive_intent", { id });
};

export const getIntentTags = async (id: ModelId) => {
  return await invoke<Tag[]>("get_intent_tags", { id });
};

export const addIntentTag = async (data: CreateIntentTag) => {
  return await invoke<void>("add_intent_tag", { data });
};

export const deleteIntentTag = async (data: DeleteIntentTag) => {
  return await invoke<void>("delete_intent_tag", { data });
};
