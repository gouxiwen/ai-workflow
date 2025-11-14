import { createWebHashHistory, createRouter } from "vue-router";

import HomeView from "@/views/homeView.vue";

const routes = [
  { path: "/", redirect: "/workflow" },
  {
    path: "/home",
    component: HomeView,
    children: [
      {
        path: "/workflow",
        component: () => import("@/views/workflowView.vue"),
      },
      {
        path: "/VForm3/lowcode",
        component: () => import("@/views/VForm3/lowcodeView.vue"),
      },
      {
        path: "/VForm3/preview",
        component: () => import("@/views/VForm3/lowcodePreview.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export async function setupRouter(app) {
  app.use(router);
  // 路由准备就绪后挂载APP实例
  await router.isReady();
}

export default router;
