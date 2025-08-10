"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import IntlTelInput from "intl-tel-input/react";
import { useTranslations } from "next-intl";
import IntlTelCssImport from "./IntlTelCssImport"; // حمّل CSS في العميل

export default function PhoneFieldIntl({
    countries,     // من useCountries(): [{id,name,key:'965',flag:'...'}, ...]
    load,          // ملاحظة: عندك اسمها load مش loading
    err,
    register,      // RHF
    setValue,      // RHF
    errors,        // RHF
    defaultDial = "+965",
    defaultIso2Fallback = "kw",
}) {
    const t = useTranslations("auth");
    const itiRef = useRef(null);
    const [mounted, setMounted] = useState(false);
    const [onlyIso2, setOnlyIso2] = useState([]);  // iso2 المسموح بها
    const [initialIso2, setInitialIso2] = useState(defaultIso2Fallback);

    // سجل الحقول في RHF واضبط قيمة مبدئية للكود
    useEffect(() => {
        register("country_code");
        register("phone");
        setValue("country_code", defaultDial);
    }, [register, setValue, defaultDial]);

    useEffect(() => setMounted(true), []);

    // جهّز Set من الأكواد المسموحة: "965","966",...
    const allowedDialSet = useMemo(() => {
        if (load || err || !countries?.length) return null;
        return new Set(countries.map(c => String(c.key)));
    }, [countries, load, err]);

    // بعد ما يكون mounted و countries جاهزة: ابنِ onlyCountries (iso2)
    useEffect(() => {
        if (!mounted) return;
        if (!allowedDialSet) return; // لسه loading أو error

        // intlTelInputGlobals متاح بعد أول استخدام للمكتبة (أو بعد تيك)
        const build = () => {
            const all = window?.intlTelInputGlobals?.getCountryData?.() || [];
            // فلترة iso2 حسب dial codes المسموح بها
            const iso2 = all
                .filter(c => allowedDialSet.has(String(c.dialCode)))
                .map(c => c.iso2);
            console.log(allowedDialSet);
            setOnlyIso2(iso2);

            // حدّد initial iso2 من defaultDial
            const target = String(defaultDial).replace(/\D+/g, "");
            const match = all.find(c => c.dialCode === target && iso2.includes(c.iso2));
            setInitialIso2(match?.iso2 || iso2[0] || defaultIso2Fallback);
        };

        // في بعض المرات globals بتتسجّل بعد microtask
        if (window?.intlTelInputGlobals?.getCountryData) {
            build();
        } else {
            setTimeout(build, 0);
        }
    }, [mounted, allowedDialSet, defaultDial, defaultIso2Fallback]);

    if (!mounted) return null;

    return (
        <div className="mb-3 d-flex flex-column">
            <IntlTelCssImport />
            <label className="form-label">{t("labels.phone")}</label>

            <IntlTelInput
                ref={itiRef}
                inputClassName={`form-control ${errors?.phone ? "is-invalid" : ""}`}
                telInputProps={{ ...register("phone"), placeholder: t("placeholders.phone") }}
                initOptions={{
                    initialCountry: initialIso2,          // iso2 المحسوبة
                    onlyCountries: Array.isArray(onlyIso2) ? onlyIso2 : [], // مهم: Array حتى لو فاضي
                    separateDialCode: true,
                    nationalMode: true,
                    // v25: loadUtils Promise
                    loadUtils: () => import("intl-tel-input/build/js/utils.js"),
                    // خيارات إضافية لو حبيت:
                    // formatOnDisplay: true,
                    // autoPlaceholder: "polite",
                    // countrySearch: true,
                }}
                onChangeNumber={() => {
                    // حدّث country_code مع كل تغيير (علشان لو الدولة اتغيرت)
                    const c = itiRef.current?.getSelectedCountryData?.();
                    if (c?.dialCode) setValue("country_code", `+${c.dialCode}`, { shouldValidate: true });
                }}
                onCountryChange={(c) => {
                    // رفض دول خارج المسموح (لو لأي سبب ظهرت)
                    if (Array.isArray(onlyIso2) && onlyIso2.length && !onlyIso2.includes(c?.iso2)) {
                        try {
                            itiRef.current?.setCountry(initialIso2);
                            const fb = itiRef.current?.getSelectedCountryData?.();
                            if (fb?.dialCode) setValue("country_code", `+${fb.dialCode}`, { shouldValidate: true });
                        } catch { }
                        return;
                    }
                    if (c?.dialCode) setValue("country_code", `+${c.dialCode}`, { shouldValidate: true });
                }}
            />

            {/* حقل مخفي يمسك كود الدولة */}
            <input type="hidden" {...register("country_code")} />

            {/* رسائل حالة */}
            {load && <small className="text-muted mt-1">{t("misc.loading")}</small>}
            {err && <small className="text-danger mt-1">{t("errors.countries_failed")}</small>}

            {/* أخطاء التحقق */}
            {errors?.country_code && <small className="text-danger mt-1">{String(errors.country_code.message)}</small>}
            {errors?.phone && <small className="text-danger">{String(errors.phone.message)}</small>}
        </div>
    );
}
