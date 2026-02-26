import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            redirect: "/login",
        },
        {
            path: "/login",
            component: () => import("@/views/LoginView.vue")
        },
        {
            path: "/register",
            component: () => import("@/views/RegisterView.vue")
        },

        {
            path: "/workbench",
            component: () => import("@/views/WorkbenchView.vue"),
            children: [
                { path: "", redirect: "tasks" },
                { path: "tasks", component: () => import("@/views/tasks/TaskListView.vue") },
                { path: "timer", component: () => import("@/views/timer/TimerView.vue") }
            ]
        }
    ],
})

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const whiteList = ["/login", "register"];
    if (!whiteList.includes(to.path) && !authStore.token) {
        return next("/login");
    } else {
        return next();
    }
});

export default router
