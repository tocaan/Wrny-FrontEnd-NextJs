import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import homeReducer from './slices/homeSlice';
import companiesReducer from './slices/companiesSlice';
import categoriesReducer from './slices/categoriesSlice';
import eventsReducer from './slices/eventsSlice';
import companyReducer from './slices/companySlice';
import eventReducer from './slices/eventSlice';
import branchesReducer from './slices/branchesSlice';

export const store = configureStore({
    reducer: {
        app: appReducer,
        home: homeReducer,
        companies: companiesReducer,
        company: companyReducer,
        categories: categoriesReducer,
        events: eventsReducer,
        event: eventReducer,
        branches: branchesReducer,
    },
});
