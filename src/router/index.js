import Vue from "vue";
import VueRouter from "vue-router";
import PostView from "@/views/PostView";
import PostListView from "@/views/PostListView";
import OAuthRedirect from "@/views/OAuthRedirect";
import Logout from "@/views/Logout";

Vue.use(VueRouter);

const routes = [
  {
    path: "/:sort?",
    name: "home",
    component: PostListView,
    props: true,
  },
  {
    path: "/r/:subreddit/:sort?",
    name: "home-sub",
    component: PostListView,
    props: true,
  },
  {
    path: "/r/:subreddit/post/:postId/:sort?",
    name: "post-view",
    component: PostView,
    props: true,
  },
  {
    path: "/_oauth/redirect",
    name: "oauth-redirect",
    component: OAuthRedirect,
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
