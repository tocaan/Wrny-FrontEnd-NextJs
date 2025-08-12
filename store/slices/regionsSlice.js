import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '@/utils/api';

const TTL_MS = 10 * 60 * 1000;

const normalizeFilters = (filters = {}) => {
    const out = {};
    for (const k of Object.keys(filters).sort()) {
        const v = filters[k];
        if (Array.isArray(v)) {
            out[k] = [...v].map((x) => (Number.isNaN(Number(x)) ? String(x) : Number(x))).sort((a, b) => {
                if (typeof a === 'number' && typeof b === 'number') return a - b;
                return String(a).localeCompare(String(b));
            });
        } else {
            out[k] = v;
        }
    }
    return out;
};

const stableKey = ({ page = 1, locale = 'en', filters = {} } = {}) => {
    return JSON.stringify({
        page: Number(page) || 1,
        locale,
        filters: normalizeFilters(filters),
    });
};

export const fetchCountries = createAsyncThunk(
    'regions/fetchCountries',
    async (_, { rejectWithValue, signal }) => {
        try {
            const { data } = await api.get('/countries', { signal });
            const list = Array.isArray(data?.data) ? data.data : [];
            return { list, fetchedAt: Date.now() };
        } catch (e) {
            if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return rejectWithValue(null);
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    },
    {
        condition: (_, { getState }) => {
            const st = getState().regions;
            if (st.countriesStatus === 'pending') return false;
            if (st.countriesFetchedAt && Date.now() - st.countriesFetchedAt < TTL_MS) return false;
            return true;
        },
    }
);

export const fetchRegionsByCountry = createAsyncThunk(
    'regions/fetchRegionsByCountry',
    async (countryId, { rejectWithValue, signal }) => {
        try {
            const { data } = await api.get(`/country/${countryId}/regions`, { signal });
            const list = Array.isArray(data?.data) ? data.data : [];
            return { countryId: String(countryId), list, fetchedAt: Date.now() };
        } catch (e) {
            if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return rejectWithValue(null);
            return rejectWithValue(e?.response?.data?.message || e.message);
        }
    },
    {
        condition: (countryId, { getState }) => {
            const st = getState().regions;
            const key = String(countryId);
            const entry = st.byCountry[key];
            if (st.statusByCountry[key] === 'pending') return false;
            if (entry?.fetchedAt && Date.now() - entry.fetchedAt < TTL_MS) return false;
            return true;
        },
    }
);

const initialState = {
    countries: [],
    countriesFetchedAt: 0,
    countriesStatus: 'idle', // idle | pending | succeeded | failed
    countriesError: null,

    byCountry: {
        // [countryId]: { list: [], fetchedAt, error }
    },
    statusByCountry: {},
    errorByCountry: {},
};

const slice = createSlice({
    name: 'regions',
    initialState,
    reducers: {},
    extraReducers: (b) => {
        // countries
        b.addCase(fetchCountries.pending, (s) => {
            s.countriesStatus = 'pending';
            s.countriesError = null;
        });
        b.addCase(fetchCountries.fulfilled, (s, { payload }) => {
            s.countriesStatus = 'succeeded';
            s.countriesError = null;
            s.countries = payload.list;
            s.countriesFetchedAt = payload.fetchedAt;
        });
        b.addCase(fetchCountries.rejected, (s, a) => {
            if (a.payload === null) { s.countriesStatus = 'idle'; return; }
            s.countriesStatus = 'failed';
            s.countriesError = a.payload;
        });

        // regions by country
        b.addCase(fetchRegionsByCountry.pending, (s, a) => {
            const id = String(a.meta.arg);
            s.statusByCountry[id] = 'pending';
            s.errorByCountry[id] = null;
        });
        b.addCase(fetchRegionsByCountry.fulfilled, (s, { payload }) => {
            const { countryId, list, fetchedAt } = payload;
            s.statusByCountry[countryId] = 'succeeded';
            s.errorByCountry[countryId] = null;
            s.byCountry[countryId] = { list, fetchedAt };
        });
        b.addCase(fetchRegionsByCountry.rejected, (s, a) => {
            const id = String(a.meta.arg);
            if (a.payload === null) { s.statusByCountry[id] = 'idle'; return; }
            s.statusByCountry[id] = 'failed';
            s.errorByCountry[id] = a.payload;
        });
    },
});

export default slice.reducer;

/* selectors */
const root = (s) => s.regions;
export const selectCountries = createSelector(root, (s) => s.countries || []);
export const selectRegionsForCountry = (countryId) =>
    createSelector(root, (s) => s.byCountry[String(countryId)]?.list || []);
export const selectRegionsStatus = (countryId) =>
    createSelector(root, (s) => s.statusByCountry[String(countryId)] || 'idle');
