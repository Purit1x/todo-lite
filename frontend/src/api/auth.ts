import http from "@/utils/http";

interface RegisterData {
    email: string;
    username: string;
    password: string;
}

interface LoginData {
    identifier: string;
    password: string;
}

type LoginResponse = {
    token: string;
    user: {
        id: string;
        username: string;
        email: string;
    }
}

type RegisterResponse = {
    id: string;
    username: string;
    email: string;
}

export const register = async (data: RegisterData) => {
    const axiosRes = await http.post<RegisterResponse>("/auth/register", data);
    return axiosRes;
}

export const login = async (data: LoginData) => {
    const axiosRes = await http.post<LoginResponse>("/auth/login", data);
    return axiosRes;
}