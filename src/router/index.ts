import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import HomePage from "../views/HomePage.vue";
import { auth } from "../firebase/config";
import { useAuth } from "../composables/useAuth";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: HomePage,
    meta: { logged: true },
  },
  {
    path: "/home",
    redirect: "/",
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/LoginPage.vue"),
    meta: { logged: true },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/RegisterPage.vue"),
    meta: { logged: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/DashboardPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/service/:id",
    name: "ServiceDetails",
    component: () => import("../views/ServiceDetailsPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/order/:serviceId/:productId",
    name: "OrderForm",
    component: () => import("../views/OrderFormPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/payment/:orderId",
    name: "Payment",
    component: () => import("../views/PaymentPage.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/orders",
    name: "Orders",
    component: () => import("../views/OrdersPage.vue"),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// const userLocal = localStorage.getItem("currentUser") as string;
// const response = JSON.parse(
//   userLocal !== "undefined" ? userLocal : `{"auth":false}`
// );
// const authLocal = response ? response.auth : false;

router.beforeEach((to, _from, next) => {
  const { userLocal } = useAuth();
  //logic proteksi router, sehingga yang belum login tidak akan bisa ke halaman dashboard, orders, dll. dan yang telah login tidak akan bisa ke halaman login

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const isLogged = to.matched.some((record) => record.meta.logged);
  const isAuthenticated = auth.currentUser || userLocal.value?.auth;

  if (requiresAuth && !isAuthenticated) {
    next("/");
  } else if (isLogged && isAuthenticated) {
    next("/dashboard");
  } else {
    next();
  }
});

export default router;
