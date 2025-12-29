// src/router/index.ts
import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "../pages/index.vue";

const routes = [{ path: "/", component: IndexPage }];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
