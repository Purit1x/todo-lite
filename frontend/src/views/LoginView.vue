<template>
    <div class="login-container">
        <ElCard class="login-form">
            <template #header>
                <div class="text-center text-xl font-semibold">用户登录</div>
            </template>

            <ElForm @submit.prevent="handleLogin" :model="form" :rules="rules" ref="formRef" label-width="80px">
                <ElFormItem label="账号" prop="identifier">
                    <ElInput v-model="form.identifier" placeholder="邮箱或id" clearable />
                </ElFormItem>

                <ElFormItem label="密码" prop="password">
                    <ElInput v-model="form.password" placeholder="密码" show-password />
                </ElFormItem>

                <ElFormItem>
                    <ElButton type="primary" native-type="submit" :loading="loading" class="w-full">登录</ElButton>
                </ElFormItem>
            </ElForm>

            <div class="text-center mt-4">
                <ElLink type="primary" :underline="'never'" @click="$router.push('/register')">
                    前往注册
                </ElLink>
            </div>
        </ElCard>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

const store = useAuthStore();
const router = useRouter();

const formRef = ref<FormInstance>();
const loading = ref(false);
const form = reactive({
    identifier: "",
    password: ""
});

const rules = reactive<FormRules>({
    identifier: [
        { required: true, message: "请输入邮箱或id", trigger: "blur" }
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" }
    ]
});

const handleLogin = async () => {
    if (!formRef.value) {
        return;
    }

    try {
        loading.value = true;
        await formRef.value.validate();

        await store.login(form.identifier, form.password);

        await new Promise(resolve => setTimeout(resolve, 100));

        await router.push("/workbench/tasks");
    } catch (err: unknown) {
        if (err == false) {
            ElMessage.error("请检查输入的凭证");
        } else if (err instanceof Error) {
            ElMessage.error(err.message);
            console.log(err);
        } else {
            ElMessage.error("Unknown Error - Login");
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #F5EFE6;
}

.login-form {
    width: 100%;
    max-width: 400px;
    background-color: #D6DDBE;
    border-radius: 8px;
}
</style>