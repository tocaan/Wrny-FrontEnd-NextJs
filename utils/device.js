export function getDeviceId() {
    if (typeof window === "undefined") return "";
    const KEY = "device_id";
    let id = localStorage.getItem(KEY);
    if (!id) {
        id = (globalThis.crypto?.randomUUID?.() ??
            `${Math.random().toString(36).slice(2)}-${Date.now()}`);
        localStorage.setItem(KEY, id);
    }
    return id;
}
