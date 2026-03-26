export type TodoPriority = "LOW" | "MEDIUM" | "HIGH" | undefined | null;

export interface Todo {
    id: string;
    title: string;
    description: string | null;
    priority: TodoPriority;
    completed: boolean;
    dueDate: string | null;
    createdAt: string;
    updatedAt: string;
};

export interface createTodoData {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;  // ISO string or null
};

export interface updateTodoData {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: "LOW" | "MEDIUM" | "HIGH";
    dueDate?: string;
};

import http from "@/utils/http";

export const getTodos = async () => {
    const axiosRes = await http.get<Todo[]>("/todo");
    return axiosRes;
};

export const createTodo = async (data: createTodoData) => {
    const axiosRes = await http.post<Todo>("/todo", data);
    return axiosRes;
};

export const updateTodo = async (id: string, data: updateTodoData) => {
    const axiosRes = await http.patch<Todo>(`/todo/${id}`, data);
    return axiosRes;
};

export const deleteTodo = async (id: string) => {
    const axiosRes = await http.delete<void>(`/todo/${id}`);
    return axiosRes;
};