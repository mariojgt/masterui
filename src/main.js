import { createApp } from "vue";
import { createRouter, createWebHistory } from 'vue-router'

import App from "./App.vue";
import Home from "./Pages/Home.vue";
import "./index.css";

const router = new createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: Home }
    ]
  })

createApp(App).
use(router).
mount("#app");
