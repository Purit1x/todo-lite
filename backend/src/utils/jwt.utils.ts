import jwt from "jsonwebtoken";

const JWT_SECRET = process.env["JWT_SECRET"];

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
}

interface UserIdJwtToken extends jwt.JwtPayload {
    userId: string
}

export const generateToken = (userId: string): string => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export const verifyToken = (token: string): UserIdJwtToken => {
    return jwt.verify(token, JWT_SECRET) as UserIdJwtToken;
}