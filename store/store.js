import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import homeReducer from './slices/homeSlice';
import companiesReducer from './slices/companiesSlice';
import categoriesReducer from './slices/categoriesSlice';
import eventsReducer from './slices/eventsSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        home: homeReducer,
        companies: companiesReducer,
        categories: categoriesReducer,
        events: eventsReducer,
    },
});
