"use client";

import AuthLayout from "../auth-layout";
// احذف PhoneField و PhoneInput القديمة إن لم تعد تستخدمها
// import PhoneField from "../components/PhoneField";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "@/store/slices/authThunks";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import RHFPhoneField from "../components/RHFPhoneField";
import { useMemo } from "react";

const makeLoginSchema = (t) =>
    z.object({
        country_code: z.string().min(1, t("validation.required")),
        phone: z
            .string()
            .min(6, t("validation.phone"))
            .regex(/^\d+$/, t("validation.phone")),
        password: z.string().min(6, t("validation.min_chars", { count: 6 })),
        remember: z.boolean().optional(),
    });

export default function LoginClientPage() {
    const t = useTranslations("auth");
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading } = useSelector((s) => s.auth);
    const search = useSearchParams();
    const locale = useLocale();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(makeLoginSchema(t)),
        defaultValues: { country_code: "+965", phone: "", remember: true },
    });

    const onSubmit = async (data) => {
        if (loading) return;

        try {
            const res = await dispatch(loginThunk(data));

            if (res?.meta?.requestStatus === "fulfilled") {
                const token = res.payload?.data?.token ?? res.payload?.token;
                if (token) {
                    document.cookie = `auth_token=${token}; Max-Age=${30 * 24 * 60 * 60}; Path=/; SameSite=Lax`;
                }
                const next = search.get("next");
                router.push(next || "/");
            } else if (res?.error) {
                setError("phone", {
                    type: "manual",
                    message: res.error.message || (locale === "ar" ? "حدث خطأ" : "An error occurred"),
                });
            }
        } catch (error) {
            setError("phone", {
                type: "manual",
                message: locale === "ar" ? "حدث خطأ في الاتصال" : "Connection error",
            });
        }
    };

    return (
        <AuthLayout illustration="/assets/images/signin.svg">
            <h1 className="mb-2 h4">{t("login.title")}</h1>
            <p className="mb-0">
                {t("login.new_here")} <Link href="/register">{t("links.register")}</Link>
            </p>

            <form className="mt-4 text-end" onSubmit={handleSubmit(onSubmit)}>
                {/* Phone */}
                <div className="mb-3 d-flex flex-column">
                    <label className="form-label">
                        {t("labels.phone")} <span className="text-danger">*</span>
                    </label>

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

                    {/* {errors.country_code && (
                        <small className="text-danger mt-1">{errors.country_code.message}</small>
                    )}
                    {errors.phone && (
                        <small className="text-danger mt-1">{errors.phone.message}</small>
                    )} */}
                </div>

                {/* Password */}
                <PasswordField label={t("labels.password")} name="password" register={register} errors={errors} />

                <div className="mb-3 d-sm-flex justify-content-between">
                    <div className="d-flex gap-2 align-items-center">
                        <input type="checkbox" className="form-check-input" id="rememberCheck" {...register("remember")} />
                        <label className="form-check-label" htmlFor="rememberCheck">
                            {t("labels.remember_me_q")}
                        </label>
                    </div>
                    <Link href="/forgot">{t("links.forgot_password")}</Link>
                </div>

                <SubmitButton loading={loading} label={t("buttons.login")} />
            </form>
        </AuthLayout>
    );
}
