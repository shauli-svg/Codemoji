export function installViewportHeightVar() {
  const update = () => document.documentElement.style.setProperty("--vh", `${window.innerHeight * 0.01}px`);
  update();
  window.addEventListener("resize", update, { passive: true });
}
