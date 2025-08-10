import { configureStore, isRejected, isFulfilled, createListenerMiddleware } from "@reduxjs/toolkit";
import appReducer from './slices/appSlice';
import homeReducer from './slices/homeSlice';
import companiesReducer from './slices/companiesSlice';
import categoriesReducer from './slices/categoriesSlice';
import eventsReducer from './slices/eventsSlice';
import companyReducer from './slices/companySlice';
import eventReducer from './slices/eventSlice';
import branchesReducer from './slices/branchesSlice';
import authReducer from "./slices/authSlice";
import accountReducer from "./slices/accountSlice";
import toast from "react-hot-toast";
const listener = createListenerMiddleware();

const TOAST_OK = new Set([
    "auth/login/fulfilled",
    "auth/register/fulfilled",
    "auth/resetPassword/fulfilled",
    "auth/verifyPhone/fulfilled",
    "auth/resendCode/fulfilled",
    "account/update/fulfilled",
]);
const TOAST_ERR = new Set([
    "auth/login/rejected",
    "auth/register/rejected",
]);

listener.startListening({
    predicate: (action) => TOAST_OK.has(action.type),
    effect: (action) => { action.payload?.msg && toast.success(action.payload.msg); }
});
listener.startListening({
    predicate: (action) => TOAST_ERR.has(action.type),
    effect: (action) => { toast.error(String(action.payload?.msg || action.error?.message)); }
});


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
        auth: authReducer,
        account: accountReducer,
    },
    middleware: (getDefault) => getDefault().concat(listener.middleware),
});
