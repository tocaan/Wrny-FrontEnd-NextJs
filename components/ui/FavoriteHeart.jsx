"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { removeFavoriteItemThunk } from "@/store/slices/accountSlice";
import FavoriteCollectionModal from "./FavoriteCollectionModal";

export default function FavoriteHeart({
    type,
    itemId,
    isFavorited,
    size = "btn-sm",
    onChange,
}) {
    const t = useTranslations("favorites");
    const dispatch = useDispatch();

    const [fav, setFav] = useState(() => !!isFavorited);
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);

    useEffect(() => {
        setFav(!!isFavorited);
    }, [isFavorited]);

    const emit = useCallback((val) => {
        setFav(val);
        onChange?.(val);
    }, [onChange]);

    const handleClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (pending) return;

        if (fav) {
            setPending(true);
            const prev = fav;
            emit(false);
            try {
                await dispatch(removeFavoriteItemThunk({ type, id: itemId })).unwrap();
                toast.success(t("toast.removed"));
            } catch {
                emit(prev);
                toast.error(t("toast.remove_failed"));
            } finally {
                setPending(false);
            }
            return;
        }

        setOpen(true);
    };

    return (
        <>
            <button
                type="button"
                className={`mb-0 btn btn-white btn-round ${size}`}
                onClick={handleClick}
                aria-label={t("aria.toggle_favorite")}
                disabled={pending}
            >
                <i className={`bi fa-fw ${fav ? "bi-heart-fill text-danger" : "bi-heart"}`} />
            </button>

            <FavoriteCollectionModal
                open={open}
                onClose={(res) => {
                    setOpen(false);
                    if (res?.ok) {
                        emit(true);
                    }
                }}
                type={type}
                itemId={itemId}
            />
        </>
    );
}
