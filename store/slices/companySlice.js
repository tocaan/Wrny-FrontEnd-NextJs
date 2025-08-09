import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const fetchCompanyDetails = createAsyncThunk(
    'company/fetchCompanyDetails',
    async (companyId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/companies/${companyId}/details`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    company: null,
    loading: false,
    error: null,
};

const companySlice = createSlice({
    name: 'company',
    initialState,
    reducers: {
        clearCompany: (state) => {
            state.company = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanyDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.company = action.payload;
            })
            .addCase(fetchCompanyDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearCompany, clearError } = companySlice.actions;
export default companySlice.reducer;
