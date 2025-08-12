// store/slices/categoriesSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../utils/api';

const TTL_MS = 10 * 60 * 1000;

export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (locale = 'en', { rejectWithValue, signal }) => {
        try {
            const { data } = await api.get('/categories', {
                signal,
                params: { lang: locale },
                headers: { 'Accept-Language': locale },
            });

            const list = Array.isArray(data?.data) ? data.data : [];
            const ids = [];
            const entities = {};
            for (const c of list) {
                if (!c?.id) continue;
                ids.push(c.id);
                entities[c.id] = c;
            }
            return { locale, ids, entities, fetchedAt: Date.now() };
        } catch (e) {
            if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') {
                return rejectWithValue(null);
            }
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    },
    {
        condition: (locale = 'en', { getState }) => {
            const st = getState().categories;
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

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchCategories.pending, (state, action) => {
            state.status = 'pending';
            state.error = null;
            state.currentLocale = action.meta.arg || state.currentLocale || 'en';
        });
        b.addCase(fetchCategories.fulfilled, (state, { payload }) => {
            state.status = 'succeeded';
            if (!payload) return;
            const { locale, ids, entities, fetchedAt } = payload;
            state.byLocale[locale] = { ids, entities, fetchedAt };
            state.currentLocale = locale;
        });
        b.addCase(fetchCategories.rejected, (state, action) => {
            if (action.payload === null) {
                state.status = 'idle';
                return;
            }
            state.status = 'failed';
            state.error = action.payload;
        });
    },
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;

/* ============== Selectors ============== */
const selectRoot = (s) => s.categories;
export const selectCategoriesStatus = createSelector(selectRoot, (s) => s.status);
export const selectCategoriesError = createSelector(selectRoot, (s) => s.error);
export const selectCategoriesEntry = (locale) =>
    createSelector(selectRoot, (s) => s.byLocale[locale] || { ids: [], entities: {}, fetchedAt: 0 });

export const selectCategoriesForLocale = (locale) =>
    createSelector(selectCategoriesEntry(locale), (entry) =>
        entry.ids.map((id) => entry.entities[id]).filter(Boolean)
    );
