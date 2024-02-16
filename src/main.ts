import './assets/main.css'
import { createApp, defineCustomElement } from 'vue'
import App from './App.vue'

customElements.define('import-overrides', defineCustomElement(App))

createApp(App).mount('#importOverrides')
