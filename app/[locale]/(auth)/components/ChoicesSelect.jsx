"use client";

import { useEffect, useMemo, useRef } from "react";
import { Controller } from "react-hook-form";

function InternalChoices({
    value,
    onChange,
    options,
    disabled,
    dir,
    placeholder,
    noResultsText,
    noChoicesText,
    loadingText,
    className,
    style,
    selectRefExternal,
}) {
    const selectRef = useRef(null);
    const choicesInstanceRef = useRef(null);

    const normalizedOptions = useMemo(() => options || [], [options]);

    // init once (client only)
    useEffect(() => {
        let destroyed = false;

        async function initChoices() {
            // حمّل السكربت والـ CSS على العميل فقط
            const [{ default: Choices }] = await Promise.all([
                import("choices.js"),
                import("choices.js/public/assets/styles/choices.min.css"),
            ]);

            if (!selectRef.current || destroyed) return;

            choicesInstanceRef.current = new Choices(selectRef.current, {
                searchEnabled: true,
                shouldSort: false,
                itemSelectText: "",
                removeItemButton: false,
                placeholderValue: placeholder,
                noResultsText,
                noChoicesText,
                loadingText,
                // مهم: كل قيمة هنا لازم تكون "class واحدة" فقط بدون مسافات
                classNames: {
                    containerOuter: "choices",     // ✅ كلاس واحد فقط
                    containerInner: "choices__inner",
                    input: "choices__input",
                    list: "choices__list",
                    // … الباقي يفضل تسيبه default
                },
            });
        }

        initChoices();

        return () => {
            destroyed = true;
            if (choicesInstanceRef.current) {
                choicesInstanceRef.current.destroy();
                choicesInstanceRef.current = null;
            }
        };
    }, [placeholder, noResultsText, noChoicesText, loadingText]);

    // update options
    useEffect(() => {
        const i = choicesInstanceRef.current;
        if (!i) return;

        i.clearChoices();
        i.setChoices(
            normalizedOptions.map((o) => ({
                value: o.value,
                label: o.label,
                selected: false,
                disabled: false,
            })),
            "value",
            "label",
            true
        );
    }, [normalizedOptions]);

    // sync value from RHF -> Choices
    useEffect(() => {
        const i = choicesInstanceRef.current;
        if (!i) return;
        i.setChoiceByValue(value || "");
    }, [value]);

    // disabled toggle
    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.disabled = !!disabled;
        }
    }, [disabled]);

    // notify RHF when UI changes
    useEffect(() => {
        const i = choicesInstanceRef.current;
        if (!i) return;

        const el = i.passedElement.element;
        const handler = (e) => onChange(e.detail.value);
        el.addEventListener("change", handler);
        return () => el.removeEventListener("change", handler);
    }, [onChange]);

    // نلف الـ select بلفافة تضيف RTL كلاس — مش داخل classNames
    return (
        <div className={dir === "rtl" ? "choices-rtl" : ""} style={style}>
            <select
                ref={(node) => {
                    selectRef.current = node;
                    if (selectRefExternal) {
                        if (typeof selectRefExternal === "function") selectRefExternal(node);
                        else selectRefExternal.current = node;
                    }
                }}
                className={className}
                defaultValue={value}
                dir={dir}
            />
        </div>
    );
}

export default function ChoicesSelect(props) {
    const {
        control,
        name,
        options,
        defaultValue,
        disabled = false,
        dir = "rtl",
        placeholder = "",
        noResultsText = "لا توجد نتائج",
        noChoicesText = "لا توجد اختيارات",
        loadingText = "جاري التحميل...",
        className = "form-control",
        style,
    } = props;

    return (
        <Controller
            name={name}
            control={control}
            defaultValue={defaultValue ?? ""}
            render={({ field }) => (
                <InternalChoices
                    value={field.value}
                    onChange={field.onChange}
                    options={options}
                    disabled={disabled}
                    dir={dir}
                    placeholder={placeholder}
                    noResultsText={noResultsText}
                    noChoicesText={noChoicesText}
                    loadingText={loadingText}
                    className={className}
                    style={style}
                    selectRefExternal={field.ref}
                />
            )}
        />
    );
}
