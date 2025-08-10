// app/[locale]/(account)/components/FavoritesSection.jsx
"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
    fetchFavoritesThunk,
    removeFavoriteThunk,
    clearFavoritesThunk,
} from "@/store/slices/accountSlice";

export default function FavoritesSection() {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector((s) => s.account.favorites);

    useEffect(() => {
        dispatch(fetchFavoritesThunk());
    }, [dispatch]);

    return (
        <div className="card border">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">المفضلة</h5>
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => dispatch(clearFavoritesThunk())}
                    disabled={loading || !items.length}
                >
                    تفريغ الكل
                </button>
            </div>

            <div className="card-body">
                {loading && <div>جارٍ التحميل…</div>}
                {error && <div className="text-danger">{error}</div>}
                {!loading && !items.length && <div>لا توجد عناصر في المفضلة</div>}

                {!loading && !!items.length && (
                    <ul className="list-group">
                        {items.map((fav) => (
                            <li
                                key={fav.id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                <div className="me-3">
                                    {/* بدّل الحقول حسب استجابة API عندك */}
                                    <div className="fw-bold">{fav.title || fav.name || `#${fav.id}`}</div>
                                    {fav.type && <small className="text-muted">{fav.type}</small>}
                                </div>

                                <button
                                    className="btn btn-sm btn-outline-secondary"
                                    onClick={() => dispatch(removeFavoriteThunk(fav.id))}
                                >
                                    إزالة
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
