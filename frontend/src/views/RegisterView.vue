<template>
    <div class="register-container">
        <ElCard class="register-form">
            <template #header>
                <div class="text-center text-xl text-semibold">
                    用户注册
                </div>
            </template>

            <ElForm @submit.prevent="handleRegister" :model="form" :rules="rules" ref="formRef" label-width="80px">
                <ElFormItem label="邮箱" prop="email">
                    <ElInput v-model="form.email" placeholder="邮箱" clearable />
                </ElFormItem>

                <ElFormItem label="用户名" prop="username">
                    <ElInput v-model="form.username" placeholder="用户名" clearable />
                </ElFormItem>

                <ElFormItem label="密码" prop="password">
                    <ElInput v-model="form.password" type="password" placeholder="密码" show-password />
                </ElFormItem>

                <ElFormItem>
                    <ElButton type="primary" native-type="submit" :loading="loading" class="w-full">
                        注册
                    </ElButton>
                </ElFormItem>
            </ElForm>

            <div class="text-center mt-4">
                <ElLink type="primary" :underline="'never'" @click="$router.push('/login')">
                    已有账号，前往登录
                </ElLink>
            </div>
        </ElCard>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { ElMessage, type FormInstance, type FormRules } from "element-plus";

const store = useAuthStore();
const router = useRouter();
const loading = ref(false);
const form = reactive({
    email: "",
    username: "",
    password: ""
});
const formRef = ref<FormInstance>();
const rules = reactive<FormRules>({
    email: [
        { required: true, message: "请输入邮箱", trigger: "blur" },
        { type: "email", message: "请输入合法邮箱", trigger: "blur" }
    ],
    username: [
        { required: true, message: "请输入用户名", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 8, message: "密码至少8位", trigger: "blur" }
    ]
})

const handleRegister = async () => {
    if (!formRef.value) {
        return;
    }

    try {
        loading.value = true;
        await formRef.value.validate();

        await store.register(form.email, form.username, form.password);
        await router.push("/login");
    } catch (err: unknown) {
        if (err == false) {
            ElMessage.error("请检查注册信息");
        } else if (err instanceof Error) {
            ElMessage.error(err.message);
        } else {
            ElMessage.error("Unknown Error - Register");
        }
    } finally {
        loading.value = false;
    }
}
</script>

<style>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    padding: 20px;
    background-color: #F5EFE6;
}

.register-form {
    width: 100%;
    max-width: 400px;
    background-color: #D6DDBE;
    border-radius: 8px;
}
</style>