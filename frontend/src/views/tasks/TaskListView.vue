<template>
    <div>
        <!-- top operation bar -->
        <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold">Todo</h2>
            <ElButton type="primary" @click="openCreateTodoDialog" size="small">添加待办</ElButton>
        </div>


        <ElTable v-loading="loading" :data="sortedTodos" row-key="id" style="width: 100%" empty-text="Congrats. 暂无待办。">
            <!-- completed status -->
            <ElTableColumn width="50">
                <template #default="{ row }">
                    <ElCheckbox v-model="row.completed" @change="(val) => toggleCompleted(row.id, Boolean(val))" />
                </template>
            </ElTableColumn>

            <!-- title -->
            <ElTableColumn prop="title" label="待办" min-width="200">
                <template #default="{ row }">
                    <span :class="{ 'line-through text-gray-500': row.completed }">
                        {{ row.title }}
                    </span>
                    <ElTag v-if="row.priority === 'HIGH'" size="small" type="danger" class="ml-4">高优先级</ElTag>
                </template>
            </ElTableColumn>

            <!-- due date -->
            <ElTableColumn label="截止日期" width="200">
                <template #default="{ row }">
                    <span v-if="row.dueDate">
                        {{ formatDate(row.dueDate) }}
                        <ElTag v-if="isOverDue(row)" size="small" type="warning" class="ml-2">
                            已超时
                        </ElTag>
                    </span>
                    <span v-else class="text-gray-400">
                        无
                    </span>
                </template>
            </ElTableColumn>

            <!-- operation -->
            <ElTableColumn label="操作" width="200">
                <template #default="{ row }">
                    <ElButton link type="primary" size="small" @click="openEditTodoDialog(row)">
                        编辑
                    </ElButton>
                    <ElButton link type="danger" size="small" @click="confirmDelete(row.id)">
                        删除
                    </ElButton>
                </template>
            </ElTableColumn>
        </ElTable>

        <!-- create/edit dialog -->
        <ElDialog :model-value="dialogVisible" :title="editingTodo ? '编辑待办' : '添加待办'" width="500px"
            @close="closeDialog">
            <ElForm :model="form" :rules="rules" ref="formRef" label-width="80px">
                <ElFormItem label="标题" prop="title">
                    <ElInput v-model="form.title" placeholder="请输入待办标题" />
                </ElFormItem>

                <ElFormItem label="描述">
                    <ElInput v-model="form.description" placeholder="请输入待办描述" />
                </ElFormItem>

                <ElFormItem label="优先级">
                    <ElRadioGroup v-model="form.priority">
                        <ElRadio value="LOW">低</ElRadio>
                        <ElRadio value="MEDIUM">中</ElRadio>
                        <ElRadio value="HIGH">高</ElRadio>
                    </ElRadioGroup>
                </ElFormItem>

                <ElFormItem label="截止日期">
                    <ElDatePicker v-model="form.dueDate" type="date" :shortcuts="shortcuts" placeholder="选择截止日期"
                        format="YYYY-MM-DD" value-format="YYYY-MM-DD" />
                </ElFormItem>
            </ElForm>

            <template #footer>
                <ElButton @click="closeDialog">取消</ElButton>
                <ElButton type="primary" @click="submitForm" :loading="submitting">确认</ElButton>
            </template>
        </ElDialog>
    </div>
</template>

<script setup lang="ts">
import { useTodoStore } from '@/stores/todo';
import type { Todo, TodoPriority } from "@/api/todo";
import { ElMessageBox, type FormInstance } from 'element-plus';
import { storeToRefs } from 'pinia';

type Priority = "LOW" | "MEDIUM" | "HIGH" | undefined;
interface FormData {
    title: string;
    description?: string;
    priority?: Priority;
    dueDate?: string;
};

// popover status
const dialogVisible = ref(false);
const editingTodo = ref<Todo | null>(null);
const form = reactive<FormData>({
    title: "",
    description: undefined,
    priority: undefined,
    dueDate: undefined
});
const rules = {
    title: [{ required: true, message: "请输入标题", trigger: "focusout" }]
};
const formRef = ref<FormInstance>();
const submitting = ref(false);

// dueDate picker
const shortcuts = [
    {
        text: "Today",
        value: () => {
            return new Date()
        }
    },
    {
        text: "Tomorrow",
        value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 24 * 1000);
            return date;
        }
    },
    {
        text: "Next Week",
        value: () => {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 24 * 1000 * 7);
            return date;
        }
    }
];

const todoStore = useTodoStore();
const { toggleCompleted, deleteTodo, createTodo, updateTodo, fetchTodos } = todoStore;
const { todos, loading } = storeToRefs(todoStore);

const openCreateTodoDialog = () => {
    editingTodo.value = null;
    Object.assign(form, {
        title: "",
        description: "",
        priority: "",
        dueDate: ""
    });
    dialogVisible.value = true;
};

const openEditTodoDialog = (todo: Todo) => {
    editingTodo.value = todo;
    Object.assign(form, {
        title: todo.title,
        description: todo.description || "",
        priority: todo.priority,
        dueDate: todo.dueDate
    });
    dialogVisible.value = true;
};

const closeDialog = () => {
    dialogVisible.value = false;
    editingTodo.value = null;
};

const submitForm = async () => {
    submitting.value = true;
    try {
        if (!formRef.value) {
            return;
        }
        await formRef.value.validate();
        if (editingTodo.value) {
            await updateTodo(editingTodo.value!.id, {
                title: form.title,
                description: form.description,
                priority: form.priority,
                dueDate: form.dueDate
            });
        } else {
            await createTodo({
                title: form.title,
                description: form.description,
                priority: form.priority,
                dueDate: form.dueDate
            });
        }
    } catch (err: unknown) {
        if (err === false) {
            ElMessage.error("请检查表单信息");
        } else if (err instanceof Error) {
            ElMessage.error(err.message);
        } else {
            ElMessage.error("提交过程发生未知错误");
        }
    } finally {
        submitting.value = false;
    }
};

const confirmDelete = (id: string) => {
    ElMessageBox.confirm("确认删除本项待办？", "提示", {
        confirmButtonText: "确认",
        cancelButtonText: "取消",
        type: "warning"
    }).then(() => {
        deleteTodo(id);
    });
};

const sortedTodos = computed(() => {
    if (!Array.isArray(todos.value)) {
        console.log("todos并非数组");
        return [];
    }

    return [...todos.value].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }

        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        const getPriorityNumber = (priority?: TodoPriority) => {
            if (priority == null) {
                return 3;
            }
            return priorityOrder[priority] ?? 3;
        };

        const aPriority = getPriorityNumber(a.priority);
        const bPriority = getPriorityNumber(b.priority);
        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        const getDateWeight = (date?: string | null) => {
            if (!date) {
                return Infinity;
            }
            return new Date(date).getTime();
        };
        const aDateWeight = getDateWeight(a.dueDate);
        const bDateWeight = getDateWeight(b.dueDate);
        return aDateWeight - bDateWeight;
    });
});

const formatDate = (isoStr: string) => {
    return new Date(isoStr).toLocaleDateString("zh-CN");
};

const isOverDue = (todo: Todo) => {
    if (!todo.dueDate || todo.completed) {
        return false;
    }
    return new Date() > new Date(todo.dueDate);
};

onMounted(() => {
    fetchTodos();
});
</script>