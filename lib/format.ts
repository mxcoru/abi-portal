export function formatSeconds(input: number) {
  let minutes = Math.floor(input / 60);
  let seconds = input % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export function getSecondsFromTime(input: string) {
  if (!input) return 0;
  if (!input.includes(":")) return parseInt(input);

  let [minutes, seconds] = input.split(":");
  return parseInt(minutes) * 60 + parseInt(seconds);
}
