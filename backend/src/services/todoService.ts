import prisma from "../models";
import { TodoPriority } from "@/generated/prisma/client";

export const createTodo = async (userId: string, data: {
    title: string;
    description?: string;
    priority?: TodoPriority;
    dueDate?: string; // ISO string
}) => {
    return prisma.todo.create({
        data: {
            title: data.title,
            description: data.description ?? null,
            priority: data.priority ?? null,
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            userId
        }
    });
};

export const getTodos = async (userId: string) => {
    return prisma.todo.findMany({
        where: { userId },
        orderBy: [
            { priority: "desc" },
            { createdAt: "desc" }
        ]
    });
};

export const updateTodo = async (userId: string, id: string, data: {
    title?: string;
    description?: string;
    completed?: boolean;
    priority?: TodoPriority;
    dueDate?: string;
}) => {
    const todo = await prisma.todo.findFirst({ where: { id, userId } });

    if (!todo) {
        throw new Error("Todo not found or unauthorized");
    }

    return prisma.todo.update({
        where: { id },
        data: {
            ...data,
            dueDate: data.dueDate ? new Date(data.dueDate) : null
        }
    });
};

export const deleteTodo = async (userId: string, id: string) => {
    const todo = await prisma.todo.findFirst({ where: { id, userId } });

    if (!todo) {
        throw new Error("Todo not found or unauthorized");
    }

    return prisma.todo.delete({ where: { id } });
};