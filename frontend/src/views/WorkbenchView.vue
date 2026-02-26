<template>
    <div class="workbench-layout">
        <ElHeader class="header">
            <div class="header-content">
                <div class="logo">Todo-Lite</div>
                <div class="user-actions">
                    <span class="username">欢迎，{{ user?.username }}</span>
                    <ElButton type="text" @click="handleLogout" size="small">登出</ElButton>
                </div>
            </div>
            <div class="header-nav">
                <ElTabs v-model="activeTab" @tab-click="handleTabClick" class="workbench-tabs">
                    <ElTabPane label="任务列表" name="tasks" />
                    <ElTabPane label="倒计时" name="timer" />
                </ElTabs>

            </div>
        </ElHeader>

        <div class="main-container">
            <RouterView class="tab-content" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import type { TabsEmits } from "element-plus";

type TabClickPane = Parameters<TabsEmits['tabClick']>[0];

const user = computed(() => useAuthStore().user);
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const activeTab = ref("tasks");

function syncTabFromRoute() {
    if (route.path.includes("tasks")) {
        activeTab.value = "tasks";
    } else if (route.path.includes("timer")) {
        activeTab.value = "timer";
    }
}

onMounted(() => {
    syncTabFromRoute();
})

const handleLogout = () => {
    authStore.logout();
    router.push("/login");
};

const handleTabClick = (tab: TabClickPane) => {
    if (tab.props?.name == "tasks") {
        router.push("/workbench/tasks");
    } else if (tab.props?.name == "timer") {
        router.push("/workbench/timer");
    }
};
</script>

<style lang="css" scoped>
.workbench-layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
}

.header {
    background-color: #ffffff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    height: auto !important;
    min-height: var(--el-height);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 20px;
}

.header-content .logo {
    font-size: 18px;
    font-weight: bold;
    color: #409eff;
}

.header-content .user-actions {
    display: flex;
    align-items: center;
    gap: 12px;
}

.header-content .username {
    color: #333;
    font-size: 14px;
}

.header-nav {
    padding: 0 20px;
}

.tab-conetnt {
    min-height: 400px;
}
</style>