<template>
    <div>
        <h2 class="text-xl font-semibold mb-4">待办列表</h2>
        <ElEmpty description="暂无待办" v-if="tasks.length == 0" />

    </div>
</template>

<script setup lang="ts">
const tasks = ref([]);
</script>