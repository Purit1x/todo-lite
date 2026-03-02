import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "@/utils/jwt.utils";
import prisma from "@/models";

interface AuthRequest extends Request {
    user?: { id: string };
}

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ error: "Unauthorized: Missing token" });
        }

        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token as string);
        const userId = decoded.userId;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(401).json({ error: "Unauthorized: Invalid User" });
        }

        (req as AuthRequest).user = { id: userId };
        next();
    } catch (error) {
        return res.status(401).json({ error: "Unauthorized: Invalid Token" });
    }
}

declare global {
    namespace Express {
        interface Request {
            user?: { id: string };
        }
    }
}
