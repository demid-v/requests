import { createRouter, createWebHistory } from "vue-router";
import Orders from "../views/Orders.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/orders",
    },
    {
      path: "/orders",
      name: "orders",
      component: Orders,
    },
    {
      path: "/form-config",
      name: "form-config",
      component: () => import("../views/FormConfig.vue"),
    },
  ],
});

export default router;
