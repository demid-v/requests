import { createRouter, createWebHistory } from "vue-router";
import Requests from "../views/Requests.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/requests",
    },
    {
      path: "/requests",
      name: "requests",
      component: Requests,
    },
    {
      path: "/form-config",
      name: "form-config",
      component: () => import("../views/FormConfig.vue"),
    },
  ],
});

export default router;
