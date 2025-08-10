import { createSlice } from "@reduxjs/toolkit";
import {
    loginThunk,
    resendCodeThunk,
    registerThunk,
    forgotThunk,
    resetPasswordThunk,
    verifyPhoneThunk,
} from "./authThunks";

const initialState = {
    user: null,
    token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
    loading: false,
    error: null,   // لازم تكون string
    info: null,    // لازم تكون string
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            if (typeof window !== "undefined") localStorage.removeItem("token");
        },
        setToken(state, { payload }) {
            state.token = payload;
            if (typeof window !== "undefined") localStorage.setItem("token", payload);
        },
        clearError(state) { state.error = null; },
        clearInfo(state) { state.info = null; },
    },
    extraReducers: (builder) => {
        // helper صغير لالتقاط الرسالة
        const msgOf = (a, fallback) =>
            a?.payload?.msg || a?.error?.message || fallback;

        // helper يطلع data بشكل موحد
        const dataOf = (payload) => payload?.data ?? payload;

        // login
        builder.addCase(loginThunk.pending, (s) => { s.loading = true; s.error = null; });
        builder.addCase(loginThunk.fulfilled, (s, { payload }) => {
            s.loading = false;
            const d = dataOf(payload);
            s.user = d?.user ?? s.user;
            s.token = d?.token ?? s.token;
            if (d?.token && typeof window !== "undefined") {
                localStorage.setItem("token", d.token);
            }
            s.info = payload?.msg || null; // لو عايز تعرض “تم تسجيل الدخول”
        });
        builder.addCase(loginThunk.rejected, (s, a) => {
            s.loading = false;
            s.error = msgOf(a, "Login failed");
        });

        // register
        builder.addCase(registerThunk.pending, (s) => { s.loading = true; s.error = null; });
        builder.addCase(registerThunk.fulfilled, (s, { payload }) => {
            s.loading = false;
            const d = dataOf(payload);
            s.user = d?.user ?? s.user;
            s.token = d?.token ?? s.token;
            if (d?.token && typeof window !== "undefined") {
                localStorage.setItem("token", d.token);
            }
            s.info = payload?.msg || null;
        });
        builder.addCase(registerThunk.rejected, (s, a) => {
            s.loading = false;
            s.error = msgOf(a, "Register failed");
        });

        // forgot
        builder.addCase(forgotThunk.pending, (s) => { s.loading = true; s.error = null; s.info = null; });
        builder.addCase(forgotThunk.fulfilled, (s, { payload }) => {
            s.loading = false;
            s.info = payload?.msg || "Request sent";
        });
        builder.addCase(forgotThunk.rejected, (s, a) => {
            s.loading = false;
            s.error = msgOf(a, "Request failed");
        });

        // reset password
        builder.addCase(resetPasswordThunk.pending, (s) => { s.loading = true; s.error = null; s.info = null; });
        builder.addCase(resetPasswordThunk.fulfilled, (s, { payload }) => {
            s.loading = false;
            s.info = payload?.msg || "Password reset successfully";
        });
        builder.addCase(resetPasswordThunk.rejected, (s, a) => {
            s.loading = false;
            s.error = msgOf(a, "Reset failed");
        });

        // verify phone
        builder.addCase(verifyPhoneThunk.pending, (s) => { s.loading = true; s.error = null; s.info = null; });
        builder.addCase(verifyPhoneThunk.fulfilled, (s, { payload }) => {
            s.loading = false;
            s.info = payload?.msg || "Phone verified successfully";
        });
        builder.addCase(verifyPhoneThunk.rejected, (s, a) => {
            s.loading = false;
            s.error = msgOf(a, "Verification failed");
        });

        // resend code
        builder.addCase(resendCodeThunk.pending, (s) => { s.loading = true; s.error = null; s.info = null; });
        builder.addCase(resendCodeThunk.fulfilled, (s, { payload }) => {
            s.loading = false;
            s.info = payload?.msg || "Code resent successfully";
        });
        builder.addCase(resendCodeThunk.rejected, (s, a) => {
            s.loading = false;
            s.error = msgOf(a, "Resend failed");
        });
    },
});

export const { logout, setToken, clearInfo, clearError } = authSlice.actions;
export default authSlice.reducer;
