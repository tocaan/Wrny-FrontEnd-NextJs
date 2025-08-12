// store/slices/companiesSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../utils/api';

const TTL_MS = 5 * 60 * 1000;

const stableKey = ({ page = 1, locale = 'en', filters = {} } = {}) => {
    const norm = (obj) =>
        Object.keys(obj || {})
            .sort()
            .reduce((acc, k) => (acc[k] = obj[k], acc), {});
    return JSON.stringify({ page: Number(page) || 1, locale, filters: norm(filters) });
};

export const fetchCompanies = createAsyncThunk(
    'companies/fetchCompanies',
    async ({ page = 1, locale = 'en', filters = {} } = {}, { signal, rejectWithValue }) => {
        try {
            const { data } = await api.get('/companies/all', {
                signal,
                params: { page, ...filters },
                headers: { 'Accept-Language': locale },
            });

            const list = Array.isArray(data?.data) ? data.data : [];
            const ids = [];
            const entities = {};
            for (const it of list) {
                if (!it?.id) continue;
                ids.push(it.id);
                entities[it.id] = it;
            }
            const meta = data?.meta || {
                current_page: Number(page) || 1,
                last_page: 1,
                total: ids.length,
                per_page: ids.length || 10,
            };

            return {
                key: stableKey({ page, locale, filters }),
                ids,
                entities,
                pagination: {
                    current_page: meta.current_page,
                    last_page: meta.last_page,
                    total: meta.total,
                    per_page: meta.per_page,
                },
                fetchedAt: Date.now(),
            };
        } catch (e) {
            if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') {
                return rejectWithValue(null);
            }
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    },
    {
        condition: ({ page = 1, locale = 'en', filters = {} } = {}, { getState }) => {
            const st = getState().companies;
            const key = stableKey({ page, locale, filters });
            if (st.statusByKey[key] === 'pending') return false;
            const entry = st.cache[key];
            if (entry && Date.now() - entry.fetchedAt < TTL_MS) return false;
            return true;
        },
    }
);

const initialState = {
    cache: {
    },
    statusByKey: {},
    errorByKey: {},
};

const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
        clearCompaniesCache(state) {
            state.cache = {};
            state.statusByKey = {};
            state.errorByKey = {};
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchCompanies.pending, (state, action) => {
            const { page = 1, locale = 'en', filters = {} } = action.meta.arg || {};
            const key = stableKey({ page, locale, filters });
            state.statusByKey[key] = 'pending';
            state.errorByKey[key] = undefined;
        });
        b.addCase(fetchCompanies.fulfilled, (state, { payload }) => {
            if (!payload) return;
            const { key, ids, entities, pagination, fetchedAt } = payload;
            state.cache[key] = { ids, entities, pagination, fetchedAt };
            state.statusByKey[key] = 'succeeded';
            state.errorByKey[key] = undefined;
        });
        b.addCase(fetchCompanies.rejected, (state, action) => {
            const { page = 1, locale = 'en', filters = {} } = action.meta.arg || {};
            const key = stableKey({ page, locale, filters });
            if (action.payload === null) {
                state.statusByKey[key] = state.statusByKey[key] === 'pending' ? 'idle' : state.statusByKey[key];
                return;
            }
            state.statusByKey[key] = 'failed';
            state.errorByKey[key] = action.payload;
        });
    },
});

export const { clearCompaniesCache } = companiesSlice.actions;
export default companiesSlice.reducer;

/* ================= Selectors ================= */
const root = (s) => s.companies;

export const makeSelectKey = (params) => stableKey(params);

export const selectCompaniesEntry = (params) =>
    createSelector(root, (st) => {
        const key = stableKey(params);
        return st.cache[key] || null;
    });

export const selectCompaniesList = (params) =>
    createSelector(selectCompaniesEntry(params), (entry) =>
        entry ? entry.ids.map((id) => entry.entities[id]).filter(Boolean) : []
    );

export const selectCompaniesStatus = (params) =>
    createSelector(root, (st) => st.statusByKey[stableKey(params)] || 'idle');

export const selectCompaniesError = (params) =>
    createSelector(root, (st) => st.errorByKey[stableKey(params)]);
