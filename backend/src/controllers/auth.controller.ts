import type { Request, Response } from "express";
import { registerUser, loginUser } from "@/services/authService";

export const register = async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const registerResult = await registerUser(email, username, password);
    if (registerResult.success) {
        res.status(201).json(registerResult.data);
    } else {
        if (registerResult.error?.code === "EMAIL_EXISTS" ||
            registerResult.error?.code === "USERNAME_EXISTS"
        ) {
            res.status(409).json({ error: registerResult.error.message });
        } else {
            res.status(500).json({ error: "Registration failed." });
        }
    }
}

export const login = async (req: Request, res: Response) => {
    const { identifier, password } = req.body;
    const loginResult = await loginUser(identifier, password);
    if (loginResult.success) {
        res.status(200).json({
            token: loginResult.data?.token,
            user: loginResult.data?.user
        });
    } else {
        if (loginResult.error?.code === "INVALID_CREDENTIALS") {
            res.status(401).json({ error: loginResult.error.message });
        } else {
            res.status(500).json({ error: "Login failed" });
        }
    }
}