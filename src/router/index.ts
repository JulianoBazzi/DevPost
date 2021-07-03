import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import firebase from "@/services/firebaseConnection";

import Dashboard from "../views/MyProfile.vue";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Profile from "../views/Profile.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/myprofile",
    name: "My Profile",
    component: Dashboard,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/profile/:userId",
    name: "Profile",
    component: Profile,
    props: true,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((page) => page.meta.requiresAuth);

  if (requiresAuth && !firebase.auth().currentUser) {
    next("/login");
  }

  next();
});

export default router;
