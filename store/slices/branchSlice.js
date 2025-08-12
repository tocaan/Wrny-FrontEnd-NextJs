import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import api from '../../utils/api';


export const fetchBranchDetails = createAsyncThunk(
    'branch/fetchBranchDetails',
    async (branchId, { rejectWithValue, signal }) => {
        try {
            const { data } = await api.get(`/companies/branch/${branchId}/details`, { signal });
            return { id: Number(branchId), data: data.data };
        } catch (err) {
            if (err.name === 'CanceledError' || err.code === 'ERR_CANCELED') {
                return rejectWithValue(null);
            }
            return rejectWithValue(err?.response?.data?.message || err.message);
        }
    },
    {
        condition: (branchId, { getState }) => {
            const state = getState().branch;
            const id = Number(branchId);
            if (state.loading === 'pending') return false;
            if (state.currentId === id && state.byId[id]) return false;
            return true;
        },
    }
);

const initialState = {
    byId: {},
    currentId: null,
    loading: 'idle',
    error: null,
};

const branchSlice = createSlice({
    name: 'branch',
    initialState,
    reducers: {
        clearBranch(state) {
            state.currentId = null;
            state.error = null;
            state.loading = 'idle';
        },
        clearError(state) {
            state.error = null;
        },
        upsertBranch(state, action) {
            const { id, data } = action.payload || {};
            if (!id || !data) return;
            state.byId[id] = data;
            state.currentId = id;
            state.error = null;
            state.loading = 'succeeded';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBranchDetails.pending, (state) => {
                state.loading = 'pending';
                state.error = null;
            })
            .addCase(fetchBranchDetails.fulfilled, (state, action) => {
                state.loading = 'succeeded';
                if (action.payload?.id) {
                    const { id, data } = action.payload;
                    state.byId[id] = data;
                    state.currentId = id;
                }
            })
            .addCase(fetchBranchDetails.rejected, (state, action) => {
                if (action.payload === null) {
                    state.loading = 'idle';
                    return;
                }
                state.loading = 'failed';
                state.error = action.payload || 'Failed to load branch';
            });
    },
});

export const { clearBranch, clearError, upsertBranch } = branchSlice.actions;
export default branchSlice.reducer;

/* ================== Selectors ================== */
const selectBranchState = (s) => s.branch;

export const selectBranchLoading = createSelector(
    selectBranchState,
    (b) => b.loading === 'pending'
);

export const selectBranchError = createSelector(selectBranchState, (b) => b.error);

export const selectCurrentBranch = createSelector(selectBranchState, (b) => {
    const id = b.currentId;
    return id ? b.byId[id] : null;
});

export const selectBranchById = (id) =>
    createSelector(selectBranchState, (b) => b.byId[Number(id)] || null);
