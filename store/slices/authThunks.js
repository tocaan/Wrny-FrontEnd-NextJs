import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { ok, fail, cc } from "@/utils/authApi";

// 1) تسجيل الدخول
export const loginThunk = createAsyncThunk(
    "auth/login",
    async ({ country_code, phone, password, remember }, { rejectWithValue }) => {
        try {
            const body = { country_code: cc(country_code), phone, password };
            const { data } = await api.post("/sign-in", body);
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "حدث خطأ", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Login failed");
        }
    }
);

// 2) إنشاء حساب (Company/User)
export const registerThunk = createAsyncThunk(
    "auth/register",
    async (
        { name, country_code, phone, email, password, type = "company" },
        { rejectWithValue }
    ) => {
        try {
            const body = {
                name,
                country_code: cc(country_code),
                phone,
                email,
                password,
                type, // "company" أو "user" حسب المطلوب
            };
            const { data } = await api.post("/sign-up", body);
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "حدث خطأ", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Register failed");
        }
    }
);

// 3) إرسال كود نسيان كلمة المرور
export const forgotThunk = createAsyncThunk(
    "auth/forgot",
    async ({ country_code, phone }, { rejectWithValue }) => {
        try {
            const body = { country_code: cc(country_code), phone };
            const { data } = await api.post("/forget-password-send-code", body);
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "حدث خطأ", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Request failed");
        }
    }
);

// 4) إعادة تعيين كلمة المرور
export const resetPasswordThunk = createAsyncThunk(
    "auth/resetPassword",
    async ({ country_code, phone, code, password }, { rejectWithValue }) => {
        try {
            const body = {
                country_code: cc(country_code),
                phone,
                code,
                password,
            };
            const { data } = await api.post("/reset-password", body);
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "Reset failed", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Reset failed");
        }
    }
);

// 5) تفعيل/تأكيد الهاتف بعد التسجيل
export const verifyPhoneThunk = createAsyncThunk(
    "auth/verifyPhone",
    async ({ country_code, phone, code, device_id }, { rejectWithValue }) => {
        try {
            const body = {
                country_code: cc(country_code),
                phone,
                code,
                device_id,
            };
            // السيرفر يتوقع PATCH، وبعض الباك إند يقبل _method
            const { data } = await api.post("/activate?_method=patch", body);
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "Verification failed", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Verification failed");
        }
    }
);

// 6) إعادة إرسال الكود
export const resendCodeThunk = createAsyncThunk(
    "auth/resendCode",
    async ({ country_code, phone }, { rejectWithValue }) => {
        try {
            const params = { country_code: cc(country_code), phone };
            const { data } = await api.get("/resend-code", { params });
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "Resend failed", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Resend failed");
        }
    }
);

// 7) تسجيل الخروج (DELETE)
export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.delete("/sign-out");
            return ok(data || { key: "success", msg: "تم تسجيل الخروج" });
        } catch (e) {
            return fail(rejectWithValue, e, "Logout failed");
        }
    }
);
