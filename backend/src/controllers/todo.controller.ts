import type { Request, Response } from "express";
import * as todoService from "@/services/todoService";

export const createTodo = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const todo = await todoService.createTodo(userId, req.body);
        res.status(201).json(todo);
    } catch (err: unknown) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Failed to create todo." });
    }
};

export const getTodos = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const todos = await todoService.getTodos(userId);
        res.status(200).json(todos);
    } catch (err: unknown) {
        res.status(500).json({ error: err instanceof Error ? err.message : "Failed to get todo list" });
    }
};

export const updateTodo = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        const todo = await todoService.updateTodo(userId, id as string, req.body);
        res.status(201).json(todo);
    } catch (err: unknown) {
        if (err instanceof Error) {
            if (err.message.includes("not found")) {
                res.status(404).json({ error: err.message });
            } else {
                res.status(400).json({ error: err.message });
            }
        } else {
            res.status(500).json({ error: "Failed to update todo." });
        }
    }
};

export const deleteTodo = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;
        const { id } = req.params;
        const todo = await todoService.deleteTodo(userId, id as string);
        res.status(201).json(todo);
    } catch (err: unknown) {
        res.status(200).json({ error: err instanceof Error ? err.message : "Failed to delete todo" });
    }
};
