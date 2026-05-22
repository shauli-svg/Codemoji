import { clear } from "./dom.js";
import { createInitialState } from "./appState.js";
import { ComposeScreen, ShareReadyScreen } from "../features/compose/ComposeScreen.js";
import { ReceiveScreen } from "../features/receive/ReceiveScreen.js";

export class App {
  constructor(root) {
    this.root = root;
    this.state = createInitialState();
    window.addEventListener("popstate", () => {
      this.state = createInitialState();
      this.render();
    });
    window.addEventListener("hashchange", () => {
      this.state = createInitialState();
      this.render();
    });
  }

  goCompose() {
    history.pushState(null, "", window.location.pathname);
    this.state = { mode: "compose" };
    this.render();
  }

  goShare(url) {
    this.state = { mode: "share", url };
    this.render();
  }

  render() {
    clear(this.root);
    if (this.state.mode === "receive") {
      this.root.append(ReceiveScreen({ rawCapsule: this.state.rawCapsule, onReply: () => this.goCompose() }));
      return;
    }
    if (this.state.mode === "share") {
      this.root.append(ShareReadyScreen({ url: this.state.url, onReset: () => this.goCompose() }));
      return;
    }
    this.root.append(ComposeScreen({ onReady: (url) => this.goShare(url), onReset: () => this.goCompose() }));
  }
}
