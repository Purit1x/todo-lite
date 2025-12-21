import prisma from "@/models";
import { hashPassword, comparePassword } from "@/utils/hash.utils";
import { generateToken } from "@/utils/jwt.utils";

interface RegisterResult {
    success: boolean;
    data?: { id: string; username: string; email: string };
    error?: { code: string; message: string };
}

interface LoginResult {
    success: boolean;
    data?: {
        token: string
        user: {
            id: string;
            email: string;
            username: string;
        }
    };
    error?: {
        code: string;
        message: string;
    }
}

export const registerUser = async (email: string, username: string, password: string): Promise<RegisterResult> => {
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
        select: { email: true, username: true }
    });

    if (existingUser) {
        return Promise.resolve({
            success: false,
            error: {
                code: existingUser.email === email ? "EMAIL_EXISTS" : "USERNAME_EXISTS",
                message: existingUser.email === email ? "邮箱已被注册" : "用户名已存在"
            }
        });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
        data: { email, username, password: hashedPassword },
        select: { email: true, username: true, id: true }
    });

    return Promise.resolve({
        success: true,
        data: user
    });
}

export const loginUser = async (identifier: string, password: string): Promise<LoginResult> => {
    const user = await prisma.user.findFirst({
        where: { OR: [{ email: identifier }, { username: identifier }] }
    });

    if (!user) {
        return {
            success: false,
            error: {
                code: "INVALID_CREDENTIALS",
                message: "用户名或密码错误"
            }
        }
    }

    const cmpResult = await comparePassword(password, user.password);
    if (!cmpResult) {
        return {
            success: false,
            error: {
                code: "INVALID_CREDENTIALS",
                message: "用户名或密码错误"
            }
        }
    }

    const token = generateToken(user.id);
    return {
        success: true,
        data: {
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            }
        }
    }
}