"use client";

import { createPortal } from "react-dom";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { createFavoriteCollectionThunk } from "@/store/slices/accountSlice";

export default function CreateCollectionModal({
    open,
    onClose,             // onClose({ok?:boolean, created?:object})
    defaultType = "companies" // "companies" | "events"
}) {
    const t = useTranslations("favorites");
    const dispatch = useDispatch();
    const [mounted, setMounted] = useState(false);

    const [name, setName] = useState("");
    const [type, setType] = useState(defaultType);

    useEffect(() => setMounted(true), []);
    useEffect(() => {
        if (open) {
            setName("");
            setType(defaultType);
            document.body.classList.add("modal-open");
        }
        return () => document.body.classList.remove("modal-open");
    }, [open, defaultType]);

    const disabled = useMemo(() => !name.trim(), [name]);

    const handleSubmit = async () => {
        try {
            const res = await dispatch(
                createFavoriteCollectionThunk({ name: name.trim(), type })
            ).unwrap();
            toast.success(t("created_collection")); // تأكد من وجود المفتاح في الترجمات
            onClose?.({ ok: true, created: res });
        } catch {
            toast.error(t("errors.create_failed") || "Failed to create");
        }
    };

    if (!open || !mounted) return null;

    return createPortal(
        <>
            <div className="modal-backdrop fade show" onClick={() => onClose?.({ ok: false })} />
            <div
                className="modal fade show"
                style={{ display: "block" }}
                role="dialog"
                aria-modal="true"
                onClick={() => onClose?.({ ok: false })}
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{t("create_modal.title")}</h5>
                            <button type="button" className="btn-close" onClick={() => onClose?.({ ok: false })} />
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">{t("create_modal.name_label")}</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={t("create_placeholder")}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-0">
                                <label className="form-label">{t("create_modal.type_label")}</label>
                                <select
                                    className="form-select"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                >
                                    <option value="companies">{t("type_companies")}</option>
                                    <option value="events">{t("type_events")}</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-outline-secondary" onClick={() => onClose?.({ ok: false })}>
                                {t("actions.cancel") || "Cancel"}
                            </button>
                            <button type="button" className="btn btn-primary" disabled={disabled} onClick={handleSubmit}>
                                {t("create_button")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx global>{`
        .modal-open { overflow: hidden; }
      `}</style>
        </>,
        document.body
    );
}
