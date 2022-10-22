import { invoke } from "@tauri-apps/api";

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
  const response: any = await invoke(method, { data: params });
  if (response.error != null) {
    console.log("ERROR - ipc_invoke - ipc_invoke error", response);
    throw new Error(response.error);
  } else {
    return response.result;
  }
}
