import { defineStore } from "pinia";
import {
    createTodo as apiCreateTodo,
    updateTodo as apiUpdateTodo,
    deleteTodo as apiDeleteTodo,
    getTodos as apiGetTodos,
    type Todo,
    type createTodoData,
    type updateTodoData
} from "@/api/todo";

export const useTodoStore = defineStore("todo", {
    state: () => ({
        todos: [] as Todo[],
        loading: false,
        error: null as string | null
    }),
    actions: {
        async fetchTodos() {
            this.loading = true;
            try {
                this.todos = await apiGetTodos();
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : "Failed to load todos";
                ElMessage.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        async createTodo(data: createTodoData) {
            this.loading = true;
            try {
                const newTodo = await apiCreateTodo(data);
                this.todos.unshift(newTodo);
                ElMessage.success("待办已添加。");
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : "Failed to create todo";
                ElMessage.error(this.error);
            } finally {
                this.loading = false;
            }
        },

        async updateTodo(id: string, data: updateTodoData) {
            this.loading = true;
            try {
                const updatedTodo = await apiUpdateTodo(id, data);
                const idx = this.todos.findIndex(t => t.id === id);
                if (idx !== -1) {
                    this.todos[idx] = updatedTodo;
                }
                ElMessage.success("指定待办已更新。");
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : "Failed to update todo";
            } finally {
                this.loading = false;
            }
        },

        async toggleCompleted(id: string, completed: boolean) {
            this.loading = true;
            try {
                const updatedTodo = await apiUpdateTodo(id, { completed });
                const idx = this.todos.findIndex(t => t.id == id);
                if (idx !== -1) {
                    this.todos[idx] = updatedTodo;
                }
                ElMessage.success("待办已完成。");
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : "Failed to update todo";
            } finally {
                this.loading = false;
            }
        },

        async deleteTodo(id: string) {
            this.loading = true;
            try {
                await apiDeleteTodo(id);
                this.todos = this.todos.filter(t => t.id !== id);
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : "Failed to delete todo";
            } finally {
                this.loading = false;
            }
        }
    }
});