export function createComposeMachine() {
  let state = "writing_secret";
  return {
    get state() {
      return state;
    },
    send(event) {
      if (event === "PATTERN_READY") state = "drawing_send_pattern";
      else if (event === "ENCRYPT") state = "encrypting";
      else if (event === "READY") state = "ready_to_share";
      else if (event === "RESET") state = "writing_secret";
      return state;
    }
  };
}
