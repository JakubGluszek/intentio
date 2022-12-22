import { invoke } from "@tauri-apps/api";

import { Session } from "@/bindings/Session";
import { SessionForCreate } from "@/bindings/SessionForCreate";

export const getSessions = async () => {
  return await invoke<Session[]>("get_sessions");
};

export const createSession = async (data: SessionForCreate) => {
  return await invoke<Session>("create_session", { data });
};
