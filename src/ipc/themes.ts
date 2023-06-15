import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { Theme } from "@/bindings/Theme";
import { CreateTheme } from "@/bindings/CreateTheme";
import { UpdateTheme } from "@/bindings/UpdateTheme";

export const createTheme = async (data: CreateTheme) => {
  return await invoke<ModelId>("create_theme", { data });
};

export const updateTheme = async (id: ModelId, data: Partial<UpdateTheme>) => {
  return await invoke<ModelId>("update_theme", { id, data });
};

export const deleteTheme = async (id: ModelId) => {
  return await invoke<ModelId>("delete_theme", { id });
};

export const getTheme = async (id: ModelId) => {
  return await invoke<Theme>("get_theme", { id });
};

export const getThemes = async () => {
  return await invoke<Theme[]>("get_themes");
};
