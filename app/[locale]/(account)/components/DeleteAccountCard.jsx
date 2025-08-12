"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { deleteAccountThunk, resetAccount } from "@/store/slices/accountSlice";
import { clearAuthArtifacts } from "@/utils/api";

export default function DeleteAccountCard() {
    const dispatch = useDispatch();
    const { deleting, deleteError } = useSelector((s) => s.account);
    const [confirmed, setConfirmed] = useState(false);
    const router = useRouter();
    const locale = useLocale();

    const t = useTranslations("pages.deleteAccount");
    const tc = useTranslations("common");

    const busyRef = useRef(false);

    const goLogin = useCallback(() => {
        router.replace(`/${locale}/login`);
    }, [router, locale]);

    const finalizeLogout = useCallback(() => {
        try {
            clearAuthArtifacts();
        } catch { }
        dispatch(resetAccount());
        goLogin();
    }, [dispatch, goLogin]);

    const handleDelete = useCallback(async () => {
        if (!confirmed || deleting || busyRef.current) return;
        busyRef.current = true;
        try {
            await dispatch(deleteAccountThunk()).unwrap();
            finalizeLogout();
        } catch (e) {
        } finally {
            busyRef.current = false;
        }
    }, [confirmed, deleting, dispatch, finalizeLogout]);

    useEffect(() => {
        if (deleteError?.toLowerCase?.().includes("unauth")) {
            finalizeLogout();
        }
    }, [deleteError, finalizeLogout]);

    return (
        <div className="vstack gap-4">
            <div className="card border">
                <div className="card-header border-bottom">
                    <h4 className="card-header-title">{tc("deleteAccount")}</h4>
                </div>

                <div className="card-body">
                    <h6>{t("beforeYouGo")}</h6>
                    <ul className="mb-3">
                        <li>{t("warningDataLost")}</li>
                    </ul>

                    <div className="form-check form-check-md my-4">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            id="deleteaccountCheck"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            disabled={deleting}
                            aria-describedby="deleteaccountHelp"
                        />
                        <label className="form-check-label" htmlFor="deleteaccountCheck">
                            {t("confirmLabel")}
                        </label>
                        <div id="deleteaccountHelp" className="form-text">
                            {t("irreversible")}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleDelete}
                        className="btn btn-danger btn-sm mb-0"
                        disabled={!confirmed || deleting || busyRef.current}
                        aria-busy={deleting || busyRef.current}
                        aria-label={t("deleteMyAccount")}
                    >
                        {deleting || busyRef.current ? t("deleting") : t("deleteMyAccount")}
                    </button>

                    {deleteError && !deleteError.toLowerCase?.().includes("unauth") && (
                        <div className="text-danger mt-2 small" role="alert">
                            {deleteError}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
