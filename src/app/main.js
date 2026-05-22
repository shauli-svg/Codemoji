import { App } from "./App.js";
import { installViewportHeightVar } from "../platform/browser/viewport.js";
import { registerServiceWorker } from "../platform/pwa/registerServiceWorker.js";

installViewportHeightVar();
registerServiceWorker();

const root = document.getElementById("app");
const app = new App(root);
app.render();
