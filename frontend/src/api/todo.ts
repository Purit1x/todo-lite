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

const getAuthHeader = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } as Record<string, string> : {} as Record<string, string>;
};

export const getTodos = async (): Promise<Todo[]> => {
    try {
        const authHeader = getAuthHeader();
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...authHeader
            }
        };

        const response = await fetch(`${import.meta.env.VITE_API_BASE}/todo`, requestOptions)

        if (!response.ok) {
            throw new Error(`Failed to fetch todos: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (err: unknown) {
        console.log("Failed to fetch todos: ", err);
        throw err;
    }
};

export const createTodo = async (data: createTodoData) => {
    try {
        const authHeader = getAuthHeader();
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...authHeader
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(`${import.meta.env.VITE_API_BASE}/todo`, requestOptions);

        if (!response.ok) {
            throw new Error(`Failed to create todos: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (err: unknown) {
        console.log("Failed to fetch todos: ", err);
        throw err;
    }
};

export const updateTodo = async (id: string, data: updateTodoData) => {
    try {
        const authHeader = getAuthHeader();
        const requestOptions = {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...authHeader
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(`${import.meta.env.VITE_API_BASE}/todo/${id}`, requestOptions);
        if (!response.ok) {
            throw new Error(`Failed to update todo: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (err: unknown) {
        console.log("Failed to update todo: ", err);
        throw err;
    }
};

export const deleteTodo = async (id: string) => {
    try {
        const authHeader = getAuthHeader();
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                ...authHeader
            },
        };
        const response = await fetch(`${import.meta.env.VITE_API_BASE}/todo/${id}`, requestOptions);
        if (!response.ok) {
            throw new Error(`Failed to delete todo: ${response.status} ${response.statusText}`);
        }
        return response.json();
    } catch (err: unknown) {
        console.log("Failed to delete todo: ", err);
        throw err;
    }
};