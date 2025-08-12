// store/slices/homeSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../utils/api';

const TTL_MS = 5 * 60 * 1000;

export const fetchHomeData = createAsyncThunk(
    'home/fetchHomeData',
    async (locale = 'en', { rejectWithValue, signal }) => {
        try {
            const { data } = await api.get('/home', {
                signal,
                params: { lang: locale },
                headers: { 'Accept-Language': locale },
            });
            const arr = Array.isArray(data?.data) ? data.data : [];
            const byType = {};
            for (const s of arr) if (s?.type) byType[s.type] = s;
            return { locale, data: arr, byType, fetchedAt: Date.now() };
        } catch (e) {
            if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') {
                return rejectWithValue(null); // إلغاء هادئ
            }
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    },
    {
        condition: (locale = 'en', { getState }) => {
            const st = getState().home;
            if (st.status === 'pending') return false;
            const entry = st.byLocale[locale];
            if (entry && Date.now() - entry.fetchedAt < TTL_MS) return false;
            return true;
        },
    }
);

const initialState = {
    byLocale: {},
    currentLocale: null,
    status: 'idle',
    error: null,
};

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {
        setCurrentLocale(state, action) {
            state.currentLocale = action.payload || 'en';
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchHomeData.pending, (state, action) => {
            state.status = 'pending';
            state.error = null;
            state.currentLocale = action.meta.arg || state.currentLocale || 'en';
        })
            .addCase(fetchHomeData.fulfilled, (state, { payload }) => {
                state.status = 'succeeded';
                if (payload) {
                    const { locale, data, byType, fetchedAt } = payload;
                    state.byLocale[locale] = { data, byType, fetchedAt };
                    state.currentLocale = locale;
                }
            })
            .addCase(fetchHomeData.rejected, (state, action) => {
                if (action.payload === null) {
                    state.status = 'idle';
                    return;
                }
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setCurrentLocale } = homeSlice.actions;
export default homeSlice.reducer;

/* ===== Selectors ===== */
const selectHomeRoot = (s) => s.home;
export const selectHomeStatus = (s) => s.home.status;
export const selectHomeError = (s) => s.home.error;

export const selectHomeForLocale = (locale) =>
    createSelector(selectHomeRoot, (h) => h.byLocale[locale] || { data: [], byType: {}, fetchedAt: 0 });

export const selectHomeSection = (locale, type) =>
    createSelector(selectHomeForLocale(locale), (entry) => entry.byType[type] || {});
