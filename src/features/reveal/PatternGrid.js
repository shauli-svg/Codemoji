import { el } from "../../app/dom.js";
import { limits } from "../../product/limits.js";

const GRID_VIEWBOX = 214;
const DOT_CENTERS = new Map([
  [1, [31, 31]],
  [2, [107, 31]],
  [3, [183, 31]],
  [4, [31, 107]],
  [5, [107, 107]],
  [6, [183, 107]],
  [7, [31, 183]],
  [8, [107, 183]],
  [9, [183, 183]]
]);

function pointsToLine(points) {
  return points
    .map((point) => DOT_CENTERS.get(point))
    .filter(Boolean)
    .map(([x, y]) => String(x) + "," + String(y))
    .join(" ");
}

export function PatternGrid({ onChange, onComplete, label = "צייר סימן" }) {
  let points = [];
  let drawing = false;
  const grid = el("div", { class: "pattern-grid", role: "group", "aria-label": label, "data-count": "0" });
  const line = el("polyline", { class: "pattern-line-path", points: "" });
  const lines = el("svg", {
    class: "pattern-lines",
    viewBox: "0 0 " + GRID_VIEWBOX + " " + GRID_VIEWBOX,
    "aria-hidden": "true",
    focusable: "false"
  }, [line]);
  const dotLayer = el("div", { class: "pattern-dot-layer" });
  const status = el("p", { class: "pattern-status", text: "" });

  function update() {
    for (const button of grid.querySelectorAll("button.dot")) {
      const n = Number(button.dataset.point);
      const active = points.includes(n);
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", active ? "true" : "false");
    }
    line.setAttribute("points", pointsToLine(points));
    grid.dataset.count = String(points.length);
    grid.classList.toggle("pattern-ready", points.length >= limits.minPatternPoints);
    status.textContent = points.length ? String(points.length) + " נקודות" : "";
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
    const dot = el("button", {
      class: "dot",
      type: "button",
      "aria-label": "נקודה " + i,
      "aria-pressed": "false"
    });
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
    dotLayer.append(dot);
  }

  grid.append(lines, dotLayer);
  window.addEventListener("pointerup", finish);
  window.addEventListener("pointercancel", finish);

  const reset = el("button", { class: "ghost pattern-reset", type: "button", text: "נקה סימן", onclick: () => {
    points = [];
    update();
  }});

  const wrap = el("div", { class: "pattern-wrap" }, [grid, status, reset]);
  wrap.getPattern = () => [...points];
  wrap.reset = () => { points = []; update(); };
  return wrap;
}
