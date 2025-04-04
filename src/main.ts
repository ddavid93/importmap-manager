import "./assets/main.css";
import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";

customElements.define("importmap-manager", defineCustomElement(App));
createApp(App).mount("#importmapManager");