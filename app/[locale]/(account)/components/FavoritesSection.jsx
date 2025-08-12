"use client";

import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
    fetchFavoriteCollectionsThunk,
    deleteFavoriteCollectionThunk,
    removeFavoriteItemThunk,
} from "@/store/slices/accountSlice";
import FavoriteHeart from "@/components/ui/FavoriteHeart";
import CreateCollectionModal from "./CreateCollectionModal";

export default function FavoritesSection() {
    const t = useTranslations("favorites");
    const dispatch = useDispatch();
    const { list, loading, error } = useSelector(s => s.account.favoriteCollections);

    const [createType, setCreateType] = useState("companies");
    const [createOpen, setCreateOpen] = useState(false);

    useEffect(() => { dispatch(fetchFavoriteCollectionsThunk()); }, [dispatch]);

    const hasCollections = useMemo(() => Array.isArray(list) && list.length > 0, [list]);

    return (
        <div className="card border">
            <div className="card-header d-flex flex-column flex-md-row gap-2 justify-content-between align-items-md-center">
                <h5 className="mb-0">{t("title")}</h5>

                <div className="d-flex gap-2">
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => setCreateOpen(true)}
                    >
                        {t("actions.create_new") || "Create new"}
                    </button>
                </div>
            </div>

            <div className="card-body">
                {loading && <div>{t("loading")}</div>}
                {error && <div className="text-danger">{error}</div>}
                {!loading && !hasCollections && <div>{t("no_collections")}</div>}

                {!loading && hasCollections && (
                    <div className="vstack gap-4">
                        {list.map((col) => (
                            <div key={col.id} className="border rounded p-3">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div>
                                        <div className="fw-bold">{col.name}</div>
                                        <small className="text-muted">
                                            {t("type_label")}: {col.type === "companies" ? t("type_companies") : t("type_events")} — {t("count_label")}: {col.items_count ?? (col.data?.length || 0)}
                                        </small>
                                    </div>
                                    <button
                                        className="btn btn-outline-danger btn-sm"
                                        onClick={() => dispatch(deleteFavoriteCollectionThunk(col.id))}
                                        disabled={loading}
                                    >
                                        {t("delete_collection")}
                                    </button>
                                </div>

                                {Array.isArray(col.data) && col.data.length > 0 ? (
                                    <ul className="list-group">
                                        {col.data.map((item) => (
                                            <li key={`${col.type}-${item.id}`} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div className="d-flex align-items-center gap-3">
                                                    {(item.logo_url || item.cover_url) ? (
                                                        <img
                                                            src={item.logo_url || item.cover_url}
                                                            alt={item.name}
                                                            width={48}
                                                            height={48}
                                                            className="rounded object-fit-cover"
                                                        />
                                                    ) : null}
                                                    <div>
                                                        <div className="fw-bold">{item.name || `#${item.id}`}</div>
                                                        <small className="text-muted">{col.type === "companies" ? t("company") : t("event")}</small>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-center gap-2">
                                                    <FavoriteHeart type={col.type} itemId={item.id} isFavorited={true} />
                                                    <button
                                                        className="btn btn-sm btn-outline-secondary"
                                                        onClick={() => dispatch(removeFavoriteItemThunk({ type: col.type, id: item.id }))}
                                                    >
                                                        {t("remove_item")}
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-muted">{t("no_items")}</div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            <CreateCollectionModal
                open={createOpen}
                defaultType={createType}
                onClose={({ ok }) => {
                    setCreateOpen(false);
                    // عند النجاح بيتم التحديث تلقائيًا من الـ thunk (أضف refetch لو Backend ما بيرجعش الزيادة)
                }}
            />
        </div>
    );
}
