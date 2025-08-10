// utils/authApi.js
import { normalizeCountryCode } from "@/utils/phone";

export const ok = (raw) => {
    const key = raw?.key ?? "success";
    const msg = raw?.msg ?? "";
    const data = raw?.data ?? null; // اجبر data تكون فقط من raw.data
    // رجّع كمان الحقول top-level زي token/user لو السيرفر رجّعها برّه data
    const token = raw?.token;
    const user = raw?.user;
    return { key, msg, data, token, user };
};

export const fail = (rejectWithValue, err, fallback = "حدث خطأ") => {
    const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        err?.message ||
        fallback;
    const data = err?.response?.data?.data ?? null;
    return rejectWithValue({ key: "fail", msg, data });
};

export const cc = (code) => normalizeCountryCode(code);
