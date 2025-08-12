import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { ok, fail, cc } from "@/utils/authApi";

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
                type,
            };
            const { data } = await api.post("/sign-up", body);
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "حدث خطأ", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Register failed");
        }
    }
);

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
            const { data } = await api.post("/activate?_method=patch", body);
            if (data?.key !== "success") return rejectWithValue({ key: data?.key || "fail", msg: data?.msg || "Verification failed", data: data?.data });
            return ok(data);
        } catch (e) {
            return fail(rejectWithValue, e, "Verification failed");
        }
    }
);

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
