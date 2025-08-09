import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

export const fetchEvents = createAsyncThunk(
    'events/fetchEvents',
    async (page = 1, { rejectWithValue }) => {
        try {
            const response = await api.get('/events/all', {
                params: { page }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    events: [],
    loading: false,
    error: null,
    pagination: {
        current_page: 1,
        last_page: 1,
        total: 0,
        per_page: 10,
    },
};

const eventsSlice = createSlice({
    name: 'events',
    initialState,
    reducers: {
        clearEvents: (state) => {
            state.events = [];
            state.pagination = initialState.pagination;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.events = action.payload.data;
                state.pagination = {
                    current_page: action.payload.meta.current_page,
                    last_page: action.payload.meta.last_page,
                    total: action.payload.meta.total,
                    per_page: action.payload.meta.per_page,
                };
            })
            .addCase(fetchEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { clearEvents, clearError } = eventsSlice.actions;
export default eventsSlice.reducer;
