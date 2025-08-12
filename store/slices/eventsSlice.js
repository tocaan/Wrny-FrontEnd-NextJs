// store/slices/eventsSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@/utils/api';

const TTL_MS = 5 * 60 * 1000;

const stableKey = ({ page = 1, locale = 'en', filters = {} } = {}) => {
    const norm = (obj) =>
        Object.keys(obj || {})
            .sort()
            .reduce((acc, k) => ((acc[k] = obj[k]), acc), {});
    return JSON.stringify({ page: Number(page) || 1, locale, filters: norm(filters) });
};

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async ({ page = 1, locale = 'en', filters = {} } = {}, { rejectWithValue, signal }) => {
        try {
            const { data } = await api.get('/events/all', {
                signal,
                params: { page, ...filters },
                headers: { 'Accept-Language': locale },
            });

            const list = Array.isArray(data?.data) ? data.data : [];
            const ids = [];
            const entities = {};
            for (const ev of list) {
                if (!ev?.id) continue;
                ids.push(ev.id);
                entities[ev.id] = ev;
            }
            const meta = data?.meta || {
                current_page: Number(page) || 1,
                last_page: 1,
                total: ids.length,
                per_page: ids.length || 12,
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
            const st = getState().events;
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

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearEventsCache(state) {
            state.cache = {};
            state.statusByKey = {};
            state.errorByKey = {};
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchEvents.pending, (state, action) => {
            const { page = 1, locale = 'en', filters = {} } = action.meta.arg || {};
            const key = stableKey({ page, locale, filters });
            state.statusByKey[key] = 'pending';
            state.errorByKey[key] = undefined;
        });
        b.addCase(fetchEvents.fulfilled, (state, { payload }) => {
            if (!payload) return;
            const { key, ids, entities, pagination, fetchedAt } = payload;
            state.cache[key] = { ids, entities, pagination, fetchedAt };
            state.statusByKey[key] = 'succeeded';
            state.errorByKey[key] = undefined;
        });
        b.addCase(fetchEvents.rejected, (state, action) => {
            const { page = 1, locale = 'en', filters = {} } = action.meta.arg || {};
            const key = stableKey({ page, locale, filters });
            if (action.payload === null) {
                // إلغاء
                state.statusByKey[key] = state.statusByKey[key] === 'pending' ? 'idle' : state.statusByKey[key];
                return;
            }
            state.statusByKey[key] = 'failed';
            state.errorByKey[key] = action.payload;
        });
    },
});

export const { clearEventsCache } = eventsSlice.actions;
export default eventsSlice.reducer;

/* ============== Selectors ============== */
const root = (s) => s.events;

export const selectEventsEntry = (params) =>
    createSelector(root, (st) => st.cache[stableKey(params)] || null);

export const selectEventsList = (params) =>
    createSelector(selectEventsEntry(params), (entry) =>
        entry ? entry.ids.map((id) => entry.entities[id]).filter(Boolean) : []
    );

export const selectEventsStatus = (params) =>
    createSelector(root, (st) => st.statusByKey[stableKey(params)] || 'idle');

export const selectEventsError = (params) =>
    createSelector(root, (st) => st.errorByKey[stableKey(params)]);
