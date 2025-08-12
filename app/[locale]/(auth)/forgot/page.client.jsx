"use client";

import AuthLayout from "../auth-layout";
import PhoneField from "../components/PhoneField";
import SubmitButton from "../components/SubmitButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { forgotThunk } from "@/store/slices/authThunks";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import RHFPhoneField from "../components/RHFPhoneField";

const makeForgotSchema = (t) =>
    z.object({
        country_code: z.string().min(1, t("validation.required")),
        phone: z.string().min(6, t("validation.phone")),
    });

export default function ForgotClientPage() {
    const t = useTranslations("auth");
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading, error } = useSelector((s) => s.auth);
    const [sent, setSent] = useState(false);
    const locale = useLocale();

    const { register, handleSubmit, formState: { errors }, setValue,
        setError,
        clearErrors, getValues } = useForm({
            resolver: zodResolver(makeForgotSchema(t)),
            defaultValues: { country_code: "+965" },
        });

    const onSubmit = async (data) => {
        if (loading) return;
        const res = await dispatch(forgotThunk(data));
        if (res?.meta?.requestStatus === "fulfilled") {
            setSent(true);
            const queryParams = new URLSearchParams({
                country_code: data.country_code,
                phone: data.phone
            });
            router.push(`/reset-password?${queryParams.toString()}`);
        }
    };

    return (
        <AuthLayout illustration="/assets/images/forgot-pass.svg">
            <h1 className="mb-2 h4">{t("forgot.title")}</h1>
            <p className="mb-0">{t("forgot.subtitle_phone")}</p>

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

                {error && <div className="alert alert-danger">{error}</div>}
                {sent && <div className="alert alert-success">{t("forgot.sent_success")}</div>}

                <div className="mb-3 text-center">
                    <p>{t("forgot.back_to")} <Link href="/login">{t("links.login")}</Link></p>
                </div>

                <SubmitButton loading={loading} label={t("buttons.reset_password")} />
            </form>
        </AuthLayout>
    );
}
