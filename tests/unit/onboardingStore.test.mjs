import test from "node:test";
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear()
};

const { onboardingStore, __resetOnboardingMemory } = await import(
  "../../src/core/storage/onboardingStore.js"
);

test("starts as first run", () => {
  store.clear();
  __resetOnboardingMemory();
  assert.equal(onboardingStore.isFirstRun(), true);
  assert.equal(onboardingStore.get().composeIntroSeen, false);
});

test("markFirstRun sets timestamp once", () => {
  store.clear();
  __resetOnboardingMemory();
  onboardingStore.markFirstRun();
  const firstRunAt = onboardingStore.get().firstRunAt;
  assert.ok(firstRunAt);
  onboardingStore.markFirstRun();
  assert.equal(onboardingStore.get().firstRunAt, firstRunAt);
});

test("intro/tour flags persist", () => {
  store.clear();
  __resetOnboardingMemory();
  onboardingStore.markComposeIntroSeen();
  onboardingStore.markReceiveIntroSeen();
  onboardingStore.markTourSeen();
  const s = onboardingStore.get();
  assert.equal(s.composeIntroSeen, true);
  assert.equal(s.receiveIntroSeen, true);
  assert.equal(s.tourSeen, true);
});

test("reset clears all flags", () => {
  store.clear();
  __resetOnboardingMemory();
  onboardingStore.markComposeIntroSeen();
  onboardingStore.reset();
  assert.equal(onboardingStore.get().composeIntroSeen, false);
  assert.equal(onboardingStore.get().firstRunAt, null);
});

test("survives storage failures by falling back to memory", () => {
  store.clear();
  __resetOnboardingMemory();
  const original = globalThis.localStorage.setItem;
  globalThis.localStorage.setItem = () => {
    throw new Error("quota");
  };
  assert.doesNotThrow(() => onboardingStore.markTourSeen());
  assert.equal(onboardingStore.get().tourSeen, true);
  globalThis.localStorage.setItem = original;
});
