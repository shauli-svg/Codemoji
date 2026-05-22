/**
 * First-run state, used by the hybrid onboarding flow.
 *
 * Stored as a single JSON blob in localStorage. No PII, no message content.
 * Safe-by-default: storage failures (incognito, private mode, denied)
 * silently fall back to the in-memory copy so the UI never breaks.
 */
const KEY = "cmx.onboarding.v1";

const memory = { state: null };

function safeLocalStorage() {
  try {
    if (typeof localStorage === "undefined") return null;
    const probe = "__cmx_probe__";
    localStorage.setItem(probe, probe);
    localStorage.removeItem(probe);
    return localStorage;
  } catch {
    return null;
  }
}

function defaultState() {
  return {
    composeIntroSeen: false,
    receiveIntroSeen: false,
    tourSeen: false,
    firstRunAt: null
  };
}

function readRaw() {
  if (memory.state) return memory.state;
  const ls = safeLocalStorage();
  if (!ls) {
    memory.state = defaultState();
    return memory.state;
  }
  try {
    const raw = ls.getItem(KEY);
    memory.state = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    memory.state = defaultState();
  }
  return memory.state;
}

function writeRaw(next) {
  memory.state = next;
  const ls = safeLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(KEY, JSON.stringify(next));
  } catch {
    /* swallow */
  }
}

export const onboardingStore = Object.freeze({
  get() {
    return { ...readRaw() };
  },
  isFirstRun() {
    return !readRaw().firstRunAt;
  },
  markFirstRun() {
    const next = { ...readRaw() };
    if (!next.firstRunAt) next.firstRunAt = new Date().toISOString();
    writeRaw(next);
  },
  markComposeIntroSeen() {
    writeRaw({ ...readRaw(), composeIntroSeen: true });
  },
  markReceiveIntroSeen() {
    writeRaw({ ...readRaw(), receiveIntroSeen: true });
  },
  markTourSeen() {
    writeRaw({ ...readRaw(), tourSeen: true });
  },
  reset() {
    writeRaw(defaultState());
  }
});

export function __resetOnboardingMemory() {
  memory.state = null;
}
