import { invoke } from "@tauri-apps/api";

import { ModelId } from "@/types";
import { Session } from "@/bindings/Session";
import { CreateSession } from "@/bindings/CreateSession";

export const createSession = async (data: CreateSession) => {
  return await invoke<ModelId>("create_session", { data });
};

export const getSession = async (id: ModelId) => {
  return await invoke<Session>("get_session", { id });
};

export const getSessions = async () => {
  return await invoke<Session[]>("get_sessions");
};
