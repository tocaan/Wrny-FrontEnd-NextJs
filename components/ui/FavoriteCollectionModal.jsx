import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import {
    fetchFavoriteCollectionsThunk,
    createFavoriteCollectionThunk,
    addFavoriteItemThunk,
} from "@/store/slices/accountSlice";
import { X } from "lucide-react";

export default function FavoriteCollectionModal({ open, onClose, type, itemId }) {
    const t = useTranslations("favorites");
    const dispatch = useDispatch();
    const { list, loading } = useSelector((s) => s.account.favoriteCollections);
    const [mounted, setMounted] = useState(false);

    const [selectedId, setSelectedId] = useState(null);
    const [createMode, setCreateMode] = useState(false);
    const [newName, setNewName] = useState("");

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (open) {
            dispatch(fetchFavoriteCollectionsThunk());
            setSelectedId(null);
            setCreateMode(false);
            setNewName("");
        }
    }, [open, dispatch]);

    useEffect(() => {
        const filteredCollections = (list || []).filter((c) => c.type === type);
        if (filteredCollections.length > 0 && selectedId === null) {
            setSelectedId(filteredCollections[0].id);
        }
    }, [list, type, selectedId]);

    const collections = (list || []).filter((c) => c.type === type);

    const onConfirm = async () => {
        try {
            let targetCollectionId = selectedId;

            if (createMode) {
                if (!newName.trim()) {
                    toast.error(t("errors.missing_name"));
                    return;
                }
                const res = await dispatch(
                    createFavoriteCollectionThunk({ name: newName.trim(), type })
                ).unwrap();
                targetCollectionId = res?.id;
                toast.success(t("created_collection"));
            }

            if (!targetCollectionId) {
                console.log("No targetCollectionId:", { selectedId, createMode, collections: collections.length });
                toast.error(t("errors.no_collections_for_type"));
                return;
            }

            await dispatch(
                addFavoriteItemThunk({ type, id: itemId, collection_id: targetCollectionId })
            ).unwrap();

            toast.success(t("toast.added"));
            onClose?.({ ok: true });
        } catch {
            onClose?.({ ok: false });
        }
    };

    if (!open || !mounted) return null;

    return createPortal(
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered" role="document" onClick={() => onClose?.({ ok: false })}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header d-flex justify-content-between align-items-center">
                        <h5 className="modal-title">{t("modal.title")}</h5>
                        <button 
                            type="button" 
                            className="btn border-1 border-secondary btn-sm py-1 px-2" 
                            onClick={() => onClose?.({ ok: false })}
                            aria-label={t("actions.close") || "إغلاق"}
                        >
                            <X className="text-danger" size={16} />
                        </button>
                    </div>
                    <div className="modal-body">
                        {!createMode ? (
                            <>
                                <label className="form-label">{t("modal.select_collection")}</label>
                                {loading ? (
                                    <div>{t("loading")}</div>
                                ) : collections.length ? (
                                    <select
                                        className="form-select"
                                        value={selectedId ?? ""}
                                        onChange={(e) => setSelectedId(Number(e.target.value))}
                                    >
                                        <option value="" disabled>
                                            {t("modal.select_collection")}
                                        </option>
                                        {collections.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} — {c.items_count ?? 0} {t("items")}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="text-muted">{t("no_collections_for_type")}</div>
                                )}
                            </>
                        ) : (
                            <>
                                <label className="form-label">{t("modal.new_collection_name")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={newName}
                                    placeholder={t("placeholders.collection_name")}
                                    onChange={(e) => setNewName(e.target.value)}
                                />
                            </>
                        )}
                    </div>
                    <div className="modal-footer">
                        {!createMode ? (
                            <>
                                <button className="btn btn-outline-secondary" onClick={() => onClose?.({ ok: false })}>
                                    {t("actions.cancel")}
                                </button>
                                <button className="btn btn-outline-primary" onClick={() => setCreateMode(true)}>
                                    {t("actions.create_new")}
                                </button>
                                <button className="btn btn-primary" onClick={onConfirm} disabled={!selectedId}>
                                    {t("actions.add")}
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-outline-secondary" onClick={() => onClose?.({ ok: false })}>
                                    {t("actions.cancel")}
                                </button>
                                <button className="btn btn-outline-primary" onClick={() => setCreateMode(false)}>
                                    {t("actions.back")}
                                </button>
                                <button className="btn btn-primary" onClick={onConfirm} disabled={!newName.trim()}>
                                    {t("actions.create_and_add")}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
