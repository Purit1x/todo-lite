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

type FailedAuthResponse = {
    code: string;
    errorMsg: string;
}

export const register = async (data: RegisterData): Promise<RegisterResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errorMsg: FailedAuthResponse = await response.json();
        throw new Error(errorMsg.errorMsg);
    }
    return response.json();
}

export const login = async (data: LoginData): Promise<LoginResponse> => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const errMsg: FailedAuthResponse = await response.json();
        throw new Error(errMsg.errorMsg);
    }
    return response.json();
}