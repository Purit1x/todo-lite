<script setup lang="ts">
const size = "default";
</script>

<template>
    <ElConfigProvider :size="size" :z-index="1000">
        <div id="app" class="min-h-screen bg-gray-50">
            <RouterView />
        </div>
    </ElConfigProvider>
</template>

<style scoped></style>
