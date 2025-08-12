// store/slices/accountSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/utils/api";
import { normalizeCountryCode } from "@/utils/phone";

const GET_PROFILE_URL = "/profile";
const UPDATE_PROFILE_URL = "/update-profile?_method=put";
const DELETE_ACCOUNT_URL = "/delete-account";

// NEW Favorites (Collections) API
const FC_BASE = "/favorite-collections";
const FC_ADD_ITEM = (type, id) => `${FC_BASE}/${type}/${id}`; // POST {collection_id}
const FC_REMOVE_ITEM = (type, id) => `${FC_BASE}/${type}/${id}`; // DELETE
const FC_DELETE_COLLECTION = (collectionId) => `${FC_BASE}/${collectionId}`; // DELETE

export const fetchAccountThunk = createAsyncThunk("account/fetch", async (_, { rejectWithValue }) => {
    try {
        const { data } = await api.get(GET_PROFILE_URL);
        return data?.data ?? data;
    } catch (e) {
        return rejectWithValue(e?.response?.data?.msg || "Failed to load profile");
    }
});

export const updateAccountThunk = createAsyncThunk("account/update", async (payload, { rejectWithValue }) => {
    try {
        const body = {
            name: payload.name, email: payload.email, phone: payload.phone,
            country_code: normalizeCountryCode(payload.country_code || "+966"),
        };
        const { data } = await api.put(UPDATE_PROFILE_URL, body);
        return data?.data ?? data;
    } catch (e) {
        return rejectWithValue(e?.response?.data?.msg || "Failed to update profile");
    }
});

export const deleteAccountThunk = createAsyncThunk("account/delete", async (_, { rejectWithValue }) => {
    try {
        await api.delete(DELETE_ACCOUNT_URL);
        return true;
    } catch (e) {
        if (e?.response?.status === 401) return true;
        return rejectWithValue(e?.response?.data?.msg || "Failed to delete account");
    }
});

/** =========================
 *  FAVORITE COLLECTIONS
 *  ========================= */
export const fetchFavoriteCollectionsThunk = createAsyncThunk(
    "account/fc/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get(FC_BASE);
            const list = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
            return list;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to load favorite collections");
        }
    }
);

export const createFavoriteCollectionThunk = createAsyncThunk(
    "account/fc/create",
    async ({ name, type }, { rejectWithValue }) => {
        try {
            const { data } = await api.post(FC_BASE, { name, type }); // type: "companies" | "events"
            return data?.data ?? data;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to create collection");
        }
    }
);

export const deleteFavoriteCollectionThunk = createAsyncThunk(
    "account/fc/delete",
    async (collectionId, { rejectWithValue }) => {
        try {
            await api.delete(FC_DELETE_COLLECTION(collectionId));
            return collectionId;
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to delete collection");
        }
    }
);

export const addFavoriteItemThunk = createAsyncThunk(
    "account/fc/addItem",
    async ({ type, id, collection_id }, { rejectWithValue }) => {
        try {
            await api.post(FC_ADD_ITEM(type, id), { collection_id }); // { collection_id }
            return { type, id, collection_id };
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to add to favorites");
        }
    }
);

export const removeFavoriteItemThunk = createAsyncThunk(
    "account/fc/removeItem",
    async ({ type, id }, { rejectWithValue }) => {
        try {
            await api.delete(FC_REMOVE_ITEM(type, id));
            return { type, id };
        } catch (e) {
            return rejectWithValue(e?.response?.data?.msg || "Failed to remove from favorites");
        }
    }
);

const initialState = {
    profile: null,
    loadingProfile: false,
    updatingProfile: false,
    error: null,

    favoriteCollections: {
        loading: false,
        error: null,
        list: /** @type {Array<{id:number,name:string,type:"companies"|"events",items_count:number,created_at:string,data?:any[]}>} */ ([]),
    },

    deleting: false,
    deleteError: null,
};

const slice = createSlice({
    name: "account",
    initialState,
    reducers: {
        resetAccount: () => initialState,
    },
    extraReducers: (b) => {
        // profile
        b.addCase(fetchAccountThunk.pending, s => { s.loadingProfile = true; s.error = null; });
        b.addCase(fetchAccountThunk.fulfilled, (s, { payload }) => { s.loadingProfile = false; s.profile = payload; });
        b.addCase(fetchAccountThunk.rejected, (s, a) => { s.loadingProfile = false; s.error = a.payload || "Failed to load profile"; });

        b.addCase(updateAccountThunk.pending, s => { s.updatingProfile = true; });
        b.addCase(updateAccountThunk.fulfilled, (s, { payload }) => { s.updatingProfile = false; s.profile = payload; });
        b.addCase(updateAccountThunk.rejected, (s, a) => { s.updatingProfile = false; s.error = a.payload || "Failed to update profile"; });

        // delete account
        b.addCase(deleteAccountThunk.pending, (s) => { s.deleting = true; s.deleteError = null; });
        b.addCase(deleteAccountThunk.fulfilled, (s) => {
            s.deleting = false;
            s.profile = null;
            s.favoriteCollections.list = [];
        });
        b.addCase(deleteAccountThunk.rejected, (s, a) => {
            s.deleting = false;
            s.deleteError = a.payload || "Failed to delete account";
        });

        // favorite collections
        b.addCase(fetchFavoriteCollectionsThunk.pending, (s) => {
            s.favoriteCollections.loading = true;
            s.favoriteCollections.error = null;
        });
        b.addCase(fetchFavoriteCollectionsThunk.fulfilled, (s, { payload }) => {
            s.favoriteCollections.loading = false;
            s.favoriteCollections.list = payload;
        });
        b.addCase(fetchFavoriteCollectionsThunk.rejected, (s, a) => {
            s.favoriteCollections.loading = false;
            s.favoriteCollections.error = a.payload || "Failed to load favorite collections";
        });

        b.addCase(createFavoriteCollectionThunk.fulfilled, (s, { payload }) => {
            s.favoriteCollections.list.unshift({ ...payload, data: [] });
        });
        b.addCase(deleteFavoriteCollectionThunk.fulfilled, (s, { payload: id }) => {
            s.favoriteCollections.list = s.favoriteCollections.list.filter(c => c.id !== id);
        });

        b.addCase(addFavoriteItemThunk.fulfilled, (s, { payload }) => {
            const { collection_id, id } = payload;
            const col = s.favoriteCollections.list.find(c => c.id === collection_id);
            if (col) {
                col.items_count = (col.items_count ?? 0) + 1;
            }
        });

        b.addCase(removeFavoriteItemThunk.fulfilled, (s, { payload }) => {
            const { type, id } = payload;
            s.favoriteCollections.list = s.favoriteCollections.list.map(c => {
                if (c.type !== type) return c;
                if (Array.isArray(c.data)) {
                    c.data = c.data.filter(item => item.id !== id);
                }
                if (typeof c.items_count === "number" && c.items_count > 0) c.items_count -= 1;
                return c;
            });
        });
    },
});

export const { resetAccount } = slice.actions;
export default slice.reducer;
