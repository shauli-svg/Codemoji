import { el } from "../../app/dom.js";
import { limits } from "../../product/limits.js";

export function PatternGrid({ onChange, onComplete, label = "צייר סימן" }) {
  let points = [];
  let drawing = false;
  const grid = el("div", { class: "pattern-grid", role: "group", "aria-label": label });
  const status = el("p", { class: "pattern-status", text: "" });

  function update() {
    for (const button of grid.querySelectorAll("button")) {
      const n = Number(button.dataset.point);
      button.classList.toggle("active", points.includes(n));
    }
    status.textContent = points.length ? "•".repeat(points.length) : "";
    onChange?.([...points]);
  }

  function push(n) {
    if (points.includes(n) || points.length >= limits.maxPatternPoints) return;
    points = [...points, n];
    update();
  }

  function finish() {
    drawing = false;
    if (points.length >= limits.minPatternPoints) onComplete?.([...points]);
  }

  for (let i = 1; i <= 9; i += 1) {
    const dot = el("button", { class: "dot", type: "button", "aria-label": `נקודה ${i}` });
    dot.dataset.point = String(i);
    dot.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      drawing = true;
      dot.setPointerCapture?.(event.pointerId);
      push(i);
    });
    dot.addEventListener("pointerenter", () => {
      if (drawing) push(i);
    });
    dot.addEventListener("click", () => push(i));
    grid.append(dot);
  }

  window.addEventListener("pointerup", finish);

  const reset = el("button", { class: "ghost", type: "button", text: "נקה", onclick: () => {
    points = [];
    update();
  }});

  const wrap = el("div", { class: "pattern-wrap" }, [grid, status, reset]);
  wrap.getPattern = () => [...points];
  wrap.reset = () => { points = []; update(); };
  return wrap;
}
