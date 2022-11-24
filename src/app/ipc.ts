import { invoke } from "@tauri-apps/api";

export interface DeleteData {
  id: string;
}

interface IpcResult<D> {
  data: D;
}

/**
  Small wrapper on top of tauri api invoke.
**/
export async function ipc_invoke<D>(
  method: string,
  params?: object
): Promise<IpcResult<D>> {
  const response: any = await invoke(method, { ...params });

  if (response.error != null) {
    throw new Error(response.error);
  } else {
    return response.result;
  }
}
