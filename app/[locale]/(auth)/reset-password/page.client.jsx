"use client";

import AuthLayout from "../auth-layout";
import SubmitButton from "../components/SubmitButton";
import PhoneField from "../components/PhoneField";
import PasswordField from "../components/PasswordField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { resetPasswordThunk, resendCodeThunk } from "@/store/slices/authThunks";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import RHFPhoneField from "../components/RHFPhoneField";

const makeResetSchema = (t) =>
    z.object({
        country_code: z.string().min(1, t("validation.required")),
        phone: z.string().min(6, t("validation.phone")),
        code: z.string().min(1, t("validation.required")),
        password: z.string().min(6, t("validation.min_chars", { count: 6 })),
    });

const TIMER_KEY = "reset_password_timer";

export default function ResetClientPasswordPage() {
    const t = useTranslations("auth");
    const dispatch = useDispatch();
    const { loading, error, info } = useSelector((s) => s.auth);
    const router = useRouter();
    const searchParams = useSearchParams();

    const phoneFromUrl = searchParams?.get("phone") || "";
    const countryCodeFromUrl = searchParams?.get("country_code") || "+966";
    const locale = useLocale();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        setError,
        clearErrors,
    } = useForm({
        resolver: zodResolver(makeResetSchema(t)),
        defaultValues: {
            country_code: countryCodeFromUrl,
            phone: phoneFromUrl,
        },
    });

    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        if (phoneFromUrl) {
            setValue("phone", phoneFromUrl);
        }
        if (countryCodeFromUrl) {
            setValue("country_code", countryCodeFromUrl);
        }
    }, [phoneFromUrl, countryCodeFromUrl, setValue]);

    useEffect(() => {
        const expiresAt = localStorage.getItem(TIMER_KEY);
        if (expiresAt) {
            const remaining = Math.floor((+expiresAt - Date.now()) / 1000);
            if (remaining > 0) {
                setSeconds(remaining);
            } else {
                localStorage.removeItem(TIMER_KEY);
            }
        }
    }, []);

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    const onSubmit = async (data) => {
        console.log(data);
        if (loading) return;
        const res = await dispatch(resetPasswordThunk(data));
        if (res?.meta?.requestStatus === "fulfilled") {
            router.push("/login");
        }
    };

    const handleResend = async () => {
        const values = getValues();
        if (!values.phone || !values.country_code) {
            toast.error(t("validation.fill_phone_first"));
            return;
        }
        const res = await dispatch(
            resendCodeThunk({ country_code: values.country_code, phone: values.phone })
        );

        if (res?.meta?.requestStatus === "fulfilled") {
            toast.success(t("toasts.code_sent"));
            const expiresAt = Date.now() + 60 * 1000;
            localStorage.setItem(TIMER_KEY, expiresAt);
            setSeconds(60);
        }
    };

    return (
        <AuthLayout illustration="/assets/images/forgot-pass.svg">
            <h1 className="mb-2 h4">{t("reset.title")}</h1>
            <p className="mb-0">{t("reset.subtitle")}</p>

            <form className="mt-4 text-end" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3 d-flex flex-column">
                    <label className="form-label">
                        {t("labels.phone")} <span className="text-danger">*</span>
                    </label>
                    {/* <PhoneField register={register} errors={errors} /> */}
                    <RHFPhoneField
                        setValue={setValue}
                        setError={setError}
                        clearErrors={clearErrors}
                        lang={locale}
                        placeholder={locale === "ar" ? "اكتب رقم هاتفك" : "Enter phone number"}
                        required
                    />

                    <input type="hidden" {...register("country_code")} />
                    <input type="hidden" {...register("phone")} />
                </div>
                <div className="mb-3">
                    <label className="form-label">{t("labels.code")}</label>
                    <input type="text" className="form-control" {...register("code")} />
                    {errors.code && <small className="text-danger">{errors.code.message}</small>}
                </div>

                <PasswordField
                    label={t("labels.new_password")}
                    name="password"
                    register={register}
                    errors={errors}
                />

                {/* زر إعادة الإرسال */}
                <div className="mb-3">
                    <button
                        type="button"
                        className="btn btn-link p-0"
                        onClick={handleResend}
                        disabled={loading || seconds > 0}
                    >
                        {seconds > 0
                            ? `${t("buttons.resend_code_in")} ${seconds} ${t("buttons.seconds")}`
                            : t("buttons.resend_code")}
                    </button>
                </div>

                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {info && <div className="alert alert-success mt-2">{info}</div>}

                <div className="mb-3 text-center">
                    <p>
                        {t("forgot.back_to")} <Link href="/login">{t("links.login")}</Link>
                    </p>
                </div>

                <SubmitButton loading={loading} label={t("buttons.reset_password")} />
            </form>
        </AuthLayout>
    );
}
