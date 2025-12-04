"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";

const ERROR_MAP_EN = { 0: "", 1: "Invalid country code", 2: "Too short", 3: "Too long", 4: "Invalid number" };
const ERROR_MAP_AR = { 0: "", 1: "كود الدولة غير صالح", 2: "الرقم قصير جدًا", 3: "الرقم طويل جدًا", 4: "رقم غير صالح" };

export default function PhoneFieldIntl({
    value = "",
    onChange,
    onValidChange,
    defaultCountry = "kw",
    preferredCountries = ["kw"],
    dir = "ltr",
    lang = "ar",
    name = "phone",
    allowedCountries = ["kw"],
    placeholder = "Enter phone number",
    required = false,
    className = "form-control",
}) {
    const inputRef = useRef(null);
    const itiRef = useRef(null);
    const errRef = useRef(null);
    const onChangeRef = useRef(onChange);
    const onValidChangeRef = useRef(onValidChange);
    const utilsReadyRef = useRef(false);
    const rafRef = useRef(null);

    const ERRORS = useMemo(() => (lang === "ar" ? ERROR_MAP_AR : ERROR_MAP_EN), [lang]);


    onChangeRef.current = onChange;
    onValidChangeRef.current = onValidChange;

    const quickValidate = (iso2, nationalDigits) => {
        if (!nationalDigits) return false;

        const validLengths = {
            kw: [8],
            eg: [10, 11],
            sa: [9, 10],
            ae: [9, 10],
            us: [10],
        };

        if (validLengths[iso2]) {
            return validLengths[iso2].includes(nationalDigits.length);
        }

        return nationalDigits.length >= 6;
    };

    const scheduleHandle = () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(handleAnyChange);
    };

    const setErrorText = (txt) => {
        if (errRef.current) {
            errRef.current.textContent = txt || "";
            errRef.current.style.display = txt ? "block" : "none";
        }
    };
    function handleAnyChange() {
        const input = inputRef.current;
        const iti = itiRef.current;
        if (!input || !iti) return;

        const data = iti.getSelectedCountryData() || {};
        const iso2 = data.iso2 || "";
        const dialCode = data.dialCode || "";
        const raw = input.value || "";
        const nationalDigits = raw.replace(/[^\d]+/g, "");

        let isValid = false;
        let errorCode = 0;
        let e164 = raw;
        let national = raw;
        let international = raw;

        if (utilsReadyRef.current && window.intlTelInputUtils) {
            e164 = iti.getNumber(); // E.164
            isValid = iti.isValidNumber();
            errorCode = isValid ? 0 : iti.getValidationError();
            national = iti.getNumber(window.intlTelInputUtils.numberFormat.NATIONAL);
            international = iti.getNumber(window.intlTelInputUtils.numberFormat.INTERNATIONAL);
        } else {
            isValid = quickValidate(iso2, nationalDigits);
            errorCode = isValid ? 0 : (nationalDigits.length ? 4 : 0);
        }

        setErrorText(ERRORS[errorCode] || "");

        onChangeRef.current?.({ e164, isValid, national, international, iso2, dialCode, raw });
        onValidChangeRef.current?.(!!isValid);
    }

    useLayoutEffect(() => {
        const input = inputRef.current;
        if (!input) return;

        itiRef.current = intlTelInput(input, {
            initialCountry: defaultCountry,
            preferredCountries,
            onlyCountries: allowedCountries,
            separateDialCode: true,
            nationalMode: true,
            autoPlaceholder: "polite",
            formatOnDisplay: true,
            // External script from Cloudflare CDN - allowed via CSP (script-src https://cdnjs.cloudflare.com)
            // TODO: Consider refactoring to use npm package or self-hosted version for better CSP compliance
            utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/25.3.2/js/utils.js",
        });

        let tries = 0;
        const poll = setInterval(() => {
            if (typeof window !== "undefined" && window.intlTelInputUtils) {
                utilsReadyRef.current = true;
                clearInterval(poll);

                if (value) {
                    try {
                        itiRef.current.setNumber(value);
                    } catch {
                        input.value = value;
                    }
                    scheduleHandle();
                }
            } else if (++tries > 120) {
                clearInterval(poll);

                if (value) {
                    input.value = value;
                    scheduleHandle();
                }
            }
        }, 50);

        input.addEventListener("input", scheduleHandle);
        input.addEventListener("countrychange", scheduleHandle);
        input.addEventListener("blur", scheduleHandle);

        if (!value) {
            scheduleHandle();
        }

        return () => {
            input.removeEventListener("input", scheduleHandle);
            input.removeEventListener("countrychange", scheduleHandle);
            input.removeEventListener("blur", scheduleHandle);
            if (itiRef.current) { itiRef.current.destroy(); itiRef.current = null; }
            clearInterval(poll);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [defaultCountry, preferredCountries, ERRORS, value]);

    return (
        <div style={{ direction: 'ltr', display: 'contents' }}>
            <input
                ref={inputRef}
                type="tel"
                name={name}
                placeholder={placeholder}
                required={required}
                className={className}
                defaultValue={value}
                autoComplete="tel"
                inputMode="tel"
            />
            <small
                ref={errRef}
                style={{ color: "crimson", marginTop: 6, display: "block", textAlign: "left" }}
            />
        </div>
    );
}
