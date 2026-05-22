export function flashWrong(node) {
  node.classList.remove("error");
  void node.offsetWidth;
  node.classList.add("error");
}
