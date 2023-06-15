import ipc from "@/ipc";

export const useTimer = () => {
  const play = async () => {
    return ipc.timerPlay();
  };

  const stop = async () => {
    return ipc.timerStop();
  };

  const restart = async () => {
    return ipc.timerRestart();
  };

  const skip = async () => {
    return ipc.timerSkip();
  };

  const setIntent = async (id: number) => {
    return ipc.timerSetIntent(id);
  };

  return {
    play,
    stop,
    restart,
    skip,
    setIntent,
  };
};
