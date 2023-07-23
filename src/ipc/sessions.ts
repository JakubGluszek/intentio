import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { Session } from "@/bindings/Session";
import { UpdateSession } from "@/bindings/UpdateSession";

export const getSession = async (id: ModelId) => {
  return await invoke<Session>("get_session", { id });
};

export const getSessions = async () => {
  return await invoke<Session[]>("get_sessions");
};

export const updateSession = async (id: number, data: UpdateSession) => {
  return await invoke<number>("update_session", { id, data });
};
