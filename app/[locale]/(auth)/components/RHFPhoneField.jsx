"use client";

import { useMemo } from "react";
import PhoneFieldIntl from "./PhoneFieldIntl";

// يحوّل الرقم الوطني لأرقام فقط
const normalizeNational = (national) => (national || "").replace(/[^\d]+/g, "");
export default function RHFPhoneField({
    setValue,
    setError,
    clearErrors,
    namePhone = "phone",
    nameCode = "country_code",
    defaultCountry = "kw",
    preferredCountries = useMemo(() => ["kw"], []),
    dir = "ltr",
    lang = "",
    placeholder = "اكتب رقم هاتفك",
    required = true,
    className = "form-control",
    defaultValue = "",
}) {

    // const preferredCountries = useMemo(() => ["kw"], []);

    return (
        <PhoneFieldIntl
            value={defaultValue}
            defaultCountry={defaultCountry}
            preferredCountries={preferredCountries}
            dir={dir}
            lang={lang}
            className={className}
            placeholder={placeholder}
            required={required}
            inputProps={{
                autoComplete: "tel",
                inputMode: "tel",
            }}
            onChange={(data) => {
                const code = data?.dialCode ? `+${data.dialCode}` : "";
                const national = normalizeNational(data?.national);

                setValue(nameCode, code, { shouldDirty: true, shouldValidate: true });
                setValue(namePhone, national, { shouldDirty: true, shouldValidate: true });

                if (data && data.isValid === false) {
                    setError?.(namePhone, {
                        type: "manual",
                        message: lang === "ar" ? "رقم الهاتف غير صالح" : "Invalid phone number",
                    });
                } else {
                    clearErrors?.(namePhone);
                }
            }}
            onValidChange={(isValid) => {
                if (isValid) clearErrors?.(namePhone);
            }}
        />
    );
}
