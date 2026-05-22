export function createReceiveMachine() {
  let state = "waiting_for_pattern";
  return {
    get state() {
      return state;
    },
    send(event) {
      if (event === "DECRYPT") state = "decrypting";
      else if (event === "REVEALED") state = "revealed";
      else if (event === "WRONG") state = "wrong_pattern";
      else if (event === "RESET") state = "waiting_for_pattern";
      return state;
    }
  };
}
