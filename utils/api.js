// utils/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

// ---- Helpers ----
function deleteCookie(name) {
    if (typeof document === "undefined") return;
    const expire = "Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    const paths = ["/", ""];
    const host = typeof location !== "undefined" ? location.hostname : "";
    const parts = host ? host.split(".") : [];
    const domains = [];

    if (host) {
        for (let i = 0; i < parts.length - 1; i++) {
            domains.push("." + parts.slice(i).join("."));
        }
    }

    for (const p of paths) {
        document.cookie = `${name}=; Max-Age=0; ${p ? `path=${p};` : ""}`;
        document.cookie = `${name}=; ${expire}; ${p ? `path=${p};` : ""}`;
    }

    for (const d of domains) {
        for (const p of paths) {
            document.cookie = `${name}=; Max-Age=0; ${p ? `path=${p};` : ""} domain=${d};`;
            document.cookie = `${name}=; ${expire}; ${p ? `path=${p};` : ""} domain=${d};`;
        }
    }
}

export function setAuthCookie(token, maxAgeSeconds = 30 * 24 * 60 * 60) {
    if (typeof document === "undefined") return;
    document.cookie = `auth_token=${token}; Max-Age=${maxAgeSeconds}; Path=/; SameSite=Lax`;
}

export function clearAuthArtifacts() {
    try { localStorage.removeItem("token"); } catch { }
    deleteCookie("auth_token");
}

// ---- Interceptors ----
// SECURITY NOTE: Storing authentication tokens in localStorage is not ideal from a security standpoint
// as it's accessible to XSS attacks. A future improvement would be to rely fully on httpOnly cookies
// set by the backend API, which are not accessible to JavaScript and provide better XSS protection.
// The current implementation uses both localStorage and cookies (auth_token) for compatibility.
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const lang = localStorage.getItem("LANG") || "ar";
        config.headers["Accept-Language"] = lang;

        const token = localStorage.getItem("token");
        if (token && token !== "null" && token !== "undefined") {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            delete config.headers.Authorization;
        }
    }
    return config;
});

let isHandling401 = false;

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const status = error?.response?.status;
        const key = error?.response?.data?.key;

        if ((status === 401 || key === "unauthenticated") && typeof window !== "undefined") {
            if (!isHandling401) {
                isHandling401 = true;
                clearAuthArtifacts();
                const lang = localStorage.getItem("LANG") || "ar";
                window.location.replace(`/${lang}/login`);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
