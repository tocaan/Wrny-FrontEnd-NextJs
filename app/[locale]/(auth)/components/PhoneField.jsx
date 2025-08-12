"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useCountries } from "@/utils/countries";
import { useTranslations } from "next-intl";

const QUICK_DEFAULTS = [{ id: "kw", name: "الكويت", key: "965", flag: "🇰🇼" }];

const normalizeCode = (val, fallback = "+965") => {
    const digits = String(val || "").replace(/[^\d]/g, "");
    return digits ? `+${digits}` : fallback;
};

export default function PhoneField({
    register,
    errors,
    defaultCode = "+965",
    setValue,
    watch,
}) {
    const t = useTranslations("auth");
    const { countries, loading, err } = useCountries();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const baseList = useMemo(
        () => (countries?.length ? countries : QUICK_DEFAULTS),
        [countries]
    );

    const currentCode = normalizeCode(
        typeof watch === "function" ? watch("country_code") : defaultCode,
        defaultCode
    );

    const listWithSelected = useMemo(() => {
        const exists = baseList?.some((c) => `+${c.key}` === currentCode);
        if (exists) return baseList;
        const shadow = { id: "__selected", key: currentCode.slice(1) };
        return [shadow, ...baseList];
    }, [baseList, currentCode]);

    const options = useMemo(
        () =>
            listWithSelected.map((c) => {
                const code = `+${c.key}`;
                return (
                    <option key={c.id ?? code} value={code}>
                        {code}
                    </option>
                );
            }),
        [listWithSelected]
    );

    const initialSynced = useRef(false);
    useEffect(() => {
        if (!mounted || initialSynced.current) return;
        if (typeof setValue === "function") {
            const raw = typeof watch === "function" ? watch("country_code") : "";
            const normalized = normalizeCode(raw, "");
            if (!normalized) {
                setValue("country_code", normalizeCode(defaultCode), {
                    shouldDirty: false,
                    shouldTouch: false,
                    shouldValidate: false,
                });
            }
        }
        initialSynced.current = true;
    }, [mounted, setValue, watch, defaultCode]);

    return (
        <div className="mb-3 d-flex flex-column">
            <label className="form-label">{t("labels.phone")}</label>

            <div className="d-flex gap-2 phone-field-container">
                <select
                    className="form-control"
                    style={{ maxWidth: 80 }}
                    {...register("country_code")}
                    disabled={!!err}
                    {...(mounted ? { "aria-busy": loading ? "true" : "false" } : {})}
                    suppressHydrationWarning
                >
                    {err ? <option>{t("errors.countries_failed")}</option> : options}
                </select>

                <input
                    type="tel"
                    className="form-control"
                    placeholder={t("placeholders.phone")}
                    {...register("phone")}
                    inputMode="tel"
                    autoComplete="tel"
                    onInput={(e) => {
                        const cleaned = e.target.value.replace(/[^\d]/g, "");
                        if (cleaned !== e.target.value) e.target.value = cleaned;
                    }}
                />
            </div>

            {errors?.country_code && (
                <small className="text-danger mt-1">{errors.country_code.message}</small>
            )}
            {errors?.phone && (
                <small className="text-danger">{errors.phone.message}</small>
            )}

            <style jsx>{`
        .phone-field-container { direction: ltr !important; }
        .phone-field-container * { direction: inherit; text-align: left !important; }
      `}</style>
        </div>
    );
}
