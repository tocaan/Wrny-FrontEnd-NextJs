import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

export const fetchEventDetails = createAsyncThunk(
    'event/fetchEventDetails',
    async (eventId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/events/${eventId}/details`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    event: null,
    loading: false,
    error: null,
};

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {
        clearEvent: (state) => {
            state.event = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.event = action.payload;
            })
            .addCase(fetchEventDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearEvent, clearError } = eventSlice.actions;
export default eventSlice.reducer;
