import { createApp } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";

import App from "./App.vue";
import { Lobby, Match } from "@scenes";

import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "", name: "Lobby", component: Lobby },
    { path: "/match", name: "Match", component: Match },
  ],
});

const vueApp = createApp(App);

// ? Loading ElementPlus icons
// https://element-plus.org/en-US/component/icon.html#register-all-icons
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  vueApp.component(key, component);
}

vueApp.use(router);
vueApp.mount("#app");
