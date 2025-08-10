// store/slices/accountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { normalizeCountryCode } from "@/utils/phone";

const GET_PROFILE_URL = "/profile";
const UPDATE_PROFILE_URL = "/update-profile?_method=put";
const DELETE_ACCOUNT_URL = "/delete-account";

// 🔖 بدّل المسارات دي لو مختلفة عندك
const FAVORITES_URL = "/favorites";
const FAVORITES_CLEAR_URL = "/favorites/clear";

// ـــــــــــــــــــــــــــــــــــ الحساب ـــــــــــــــــــــــــــــــــــ

export const fetchAccountThunk = createAsyncThunk(
    "account/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(GET_PROFILE_URL);
            return data?.data ?? data;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to load profile");
        }
    }
);

export const updateAccountThunk = createAsyncThunk(
    "account/update",
    async (payload, { rejectWithValue }) => {
        try {
            const body = {
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                country_code: normalizeCountryCode(payload.country_code || "+966"),
            };
            const { data } = await api.put(UPDATE_PROFILE_URL, body);
            return data?.data ?? data;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to update profile");
        }
    }
);

// ✅ حذف الحساب
export const deleteAccountThunk = createAsyncThunk(
    "account/delete",
    async (_, { rejectWithValue }) => {
        try {
            await api.delete(DELETE_ACCOUNT_URL);
            return true;
        } catch (e) {
            // لو الأكاونت أصلاً متشال/التوكن بايظ، اعتبرها "نجاح" علشان نفضي الحالة محليًا
            if (e?.response?.status === 401) return true;
            return rejectWithValue(e?.response?.data?.msg || "Failed to delete account");
        }
    }
);

// ـــــــــــــــــــــــــــــــــــ المفضلة ـــــــــــــــــــــــــــــــــــ

export const fetchFavoritesThunk = createAsyncThunk(
    "account/favorites/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(FAVORITES_URL);
            // غيّر شكل الإرجاع حسب API عندك
            return Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to load favorites");
        }
    }
);

export const removeFavoriteThunk = createAsyncThunk(
    "account/favorites/remove",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`${FAVORITES_URL}/${id}`);
            return id;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to remove favorite");
        }
    }
);

export const clearFavoritesThunk = createAsyncThunk(
    "account/favorites/clear",
    async (_, { rejectWithValue }) => {
        try {
            // لو API عندك بيستخدم DELETE /favorites فقط، بدّل للسطر: await api.delete(FAVORITES_URL);
            await api.delete(FAVORITES_CLEAR_URL);
            return true;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to clear favorites");
        }
    }
);

// ـــــــــــــــــــــــــــــــــــ الحالة ـــــــــــــــــــــــــــــــــــ

const initialState = {
    profile: null,
    loadingProfile: false,
    updatingProfile: false,
    error: null,

    favorites: { items: [], loading: false, error: null },
    deleting: false,
    deleteError: null,
};

const slice = createSlice({
    name: "account",
    initialState,
    reducers: {
        // في حالة عايز تنظّف الـ state يدويًا (مثلاً بعد logout)
        resetAccount: () => initialState,
    },
    extraReducers: (b) => {
        // fetch profile
        b.addCase(fetchAccountThunk.pending, s => { s.loadingProfile = true; s.error = null; });
        b.addCase(fetchAccountThunk.fulfilled, (s, { payload }) => { s.loadingProfile = false; s.profile = payload; });
        b.addCase(fetchAccountThunk.rejected, (s, a) => { s.loadingProfile = false; s.error = a.payload || "Failed to load profile"; });

        b.addCase(updateAccountThunk.pending, s => { s.updatingProfile = true; });
        b.addCase(updateAccountThunk.fulfilled, (s, { payload }) => { s.updatingProfile = false; s.profile = payload; });
        b.addCase(updateAccountThunk.rejected, (s, a) => { s.updatingProfile = false; s.error = a.payload || "Failed to update profile"; });

        // delete account
        b.addCase(deleteAccountThunk.pending, (s) => { s.deleting = true; s.deleteError = null; });
        b.addCase(deleteAccountThunk.fulfilled, (s) => {
            s.deleting = false;
            // فضّي كل حاجة محلية
            s.profile = null;
            s.favorites.items = [];
        });
        b.addCase(deleteAccountThunk.rejected, (s, a) => {
            s.deleting = false;
            s.deleteError = a.payload || "Failed to delete account";
        });

        // favorites: fetch
        b.addCase(fetchFavoritesThunk.pending, (s) => {
            s.favorites.loading = true;
            s.favorites.error = null;
        });
        b.addCase(fetchFavoritesThunk.fulfilled, (s, { payload }) => {
            s.favorites.loading = false;
            s.favorites.items = payload;
        });
        b.addCase(fetchFavoritesThunk.rejected, (s, a) => {
            s.favorites.loading = false;
            s.favorites.error = a.payload || "Failed to load favorites";
        });

        // favorites: remove item
        b.addCase(removeFavoriteThunk.fulfilled, (s, { payload: id }) => {
            s.favorites.items = s.favorites.items.filter((x) => x.id !== id);
        });

        // favorites: clear all
        b.addCase(clearFavoritesThunk.fulfilled, (s) => {
            s.favorites.items = [];
        });
    },
});

export const { resetAccount } = slice.actions;
export default slice.reducer;
