import { invoke } from "@tauri-apps/api";

import { Theme } from "@/bindings/Theme";
import { ThemeForCreate } from "@/bindings/ThemeForCreate";
import { ThemeForUpdate } from "@/bindings/ThemeForUpdate";
import { ModelDeleteResultData } from "@/bindings/ModelDeleteResultData";

export const getThemes = async () => {
  return await invoke<Theme[]>("get_themes");
};

export const createTheme = async (data: ThemeForCreate) => {
  return await invoke<Theme>("create_theme", { data });
};

export const updateTheme = async (id: string, data: ThemeForUpdate) => {
  return await invoke<Theme>("update_theme", { id, data });
};

export const deleteTheme = async (id: string) => {
  return await invoke<ModelDeleteResultData>("delete_theme", { id });
};

export const deleteThemes = async (ids: string[]) => {
  return await invoke<ModelDeleteResultData[]>("delete_themes", { ids });
};
