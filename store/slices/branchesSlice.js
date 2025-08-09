import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCompanyBranches = createAsyncThunk(
    'branches/fetchCompanyBranches',
    async ({ companyId, page = 1 }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/companies/${companyId}/branches`, {
                params: { page }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    branches: [],
    loading: false,
    error: null,
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    },
};

const branchesSlice = createSlice({
    name: 'branches',
    initialState,
    reducers: {
        clearBranches: (state) => {
            state.branches = [];
            state.pagination = initialState.pagination;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanyBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload.data;
                state.pagination = {
                    current_page: action.payload.meta.current_page,
                    last_page: action.payload.meta.last_page,
                    total: action.payload.meta.total,
                    per_page: action.payload.meta.per_page,
                };
            })
            .addCase(fetchCompanyBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBranches, clearError } = branchesSlice.actions;
export default branchesSlice.reducer;
