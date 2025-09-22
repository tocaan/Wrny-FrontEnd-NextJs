// store/slices/settingsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    /** @param {string} locale */
    async (locale = 'ar', { rejectWithValue, signal }) => {
        try {
            const { data } = await api.get('/settings', {
                signal,
                params: { lang: locale },
                headers: { 'Accept-Language': locale },
            });
            const payload = data?.data ?? data;
            return { locale, data: payload, fetchedAt: Date.now() };
        } catch (e) {
            const message = e?.response?.data?.msg || e?.message || 'Failed to load settings';
            return rejectWithValue({ locale, message });
        }
    },
    {
        condition: (locale = 'ar', { getState }) => {
            const st = getState().settings;
            if (!st) return true;
            const entry = st.byLocale?.[locale];
            if (!entry) return true;
            if (st.status === 'pending') return false;
            return Date.now() - entry.fetchedAt > CACHE_TTL_MS;
        },
    }
);

const initialState = {
    byLocale: {}, // { [locale]: { data, fetchedAt } }
    status: 'idle',
    error: null,
};

const slice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSettings.pending, (state) => {
                state.status = 'pending';
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                state.byLocale[payload.locale] = {
                    data: payload.data,
                    fetchedAt: payload.fetchedAt,
                };
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to load settings';
            });
    },
});

export const selectSettingsByLocale = (state, locale = 'ar') => state.settings.byLocale?.[locale]?.data || null;
export const selectSocialsByLocale = (state, locale = 'ar') => {
    const st = state.settings.byLocale?.[locale]?.data;
    return Array.isArray(st?.socials) ? st.socials : [];
};

export default slice.reducer;


