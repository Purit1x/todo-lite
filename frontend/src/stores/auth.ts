import { defineStore } from "pinia";
import { register as apiRegister, login as apiLogin } from "@/api/auth";
import Cookies from 'js-cookie';

interface User {
    email: string;
    id: string;
    username: string;
}

export const useAuthStore = defineStore("auth", {
    state: () => ({
        token: Cookies.get("token") || null,
        user: JSON.parse(Cookies.get("user") || "null") as User | null,
        loading: false,
        error: null as string | null
    }),

    actions: {
        async register(email: string, username: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const user = await apiRegister({ email, username, password });
                return user;
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : "Registration failed";
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async login(identifier: string, password: string) {
            this.loading = true;
            this.error = null;
            try {
                const { token, user } = await apiLogin({ identifier, password });
                this.setAuth(token, user);
                return user;
            } catch (err: unknown) {
                this.error = err instanceof Error ? err.message : "Login failed";
                throw err;
            } finally {
                this.loading = false;
            }
        },

        setAuth(token: string, user: User) {
            this.token = token;
            this.user = user;
            Cookies.set("token", token, {
                expires: 7,
                secure: import.meta.env.PROD,
                sameSite: "strict"
            });
            Cookies.set("user", JSON.stringify(user), {
                expires: 7,
                secure: import.meta.env.PROD,
                sameSite: "strict"
            });
        },

        logout() {
            this.token = null;
            this.user = null;
            Cookies.remove("token");
            Cookies.remove("user");
        }
    }
});