export function createReplyMachine() {
  return { state: "prompt", send: () => "compose" };
}
