export function isUserLoggedIn() {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        return !!token;
    }
    return false;
}
