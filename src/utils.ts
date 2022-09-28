export const formatTime = (sec: number): String => {
  let seconds = sec % 60;
  let minutes = ((sec - seconds) / 60).toFixed();
  return `
    ${minutes.length === 1 ? "0" : ""}${minutes}:${
    seconds < 10 && seconds > 0 ? "0" : ""
  }${seconds}${seconds === 0 ? "0" : ""}
  `;
};
