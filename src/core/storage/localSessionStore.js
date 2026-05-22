const PREFIX = "cmx.session.";

export const localSessionStore = Object.freeze({
  set(key, value) {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(value));
  },
  get(key) {
    const raw = sessionStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  },
  remove(key) {
    sessionStorage.removeItem(PREFIX + key);
  }
});
