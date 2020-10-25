import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home";
import OAuthRedirect from "@/views/OAuthRedirect";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/_oauth/redirect",
    name: "oauth-redirect",
    component: OAuthRedirect,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
