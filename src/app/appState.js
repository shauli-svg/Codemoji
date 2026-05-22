export function createInitialState() {
  const hash = window.location.hash.slice(1);
  return hash ? { mode: "receive", rawCapsule: hash } : { mode: "compose" };
}
