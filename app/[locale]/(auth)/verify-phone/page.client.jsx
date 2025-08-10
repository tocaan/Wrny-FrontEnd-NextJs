"use client";

import AuthLayout from "../auth-layout";
import SubmitButton from "../components/SubmitButton";
import PhoneField from "../components/PhoneField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { verifyPhoneThunk, resendCodeThunk } from "@/store/slices/authThunks";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/routing";
import toast from "react-hot-toast";
import { getDeviceId } from "@/utils/device";

const makeVerifySchema = (t) =>
    z.object({
        country_code: z.string().min(1, t("validation.required")),
        phone: z.string().min(6, t("validation.phone")),
        code: z.string().min(1, t("validation.required")),
        device_id: z.string().min(1, t("validation.required")),
    });

const TIMER_KEY = "verify_phone_timer";

export default function VerifyPhoneClientPage() {
    const t = useTranslations("auth");
    const dispatch = useDispatch();
    const { loading, error, info } = useSelector((s) => s.auth);
    const router = useRouter();

    const { register, handleSubmit, control, formState: { errors }, getValues, setValue } = useForm({
        resolver: zodResolver(makeVerifySchema(t)),
        defaultValues: { country_code: "+966", device_id: "" },
    });

    const [seconds, setSeconds] = useState(0);

    // جهّز device_id مخفيًا
    useEffect(() => {
        const id = getDeviceId();
        setValue("device_id", id, { shouldValidate: true });
    }, [setValue]);

    // مؤقت إعادة الإرسال
    useEffect(() => {
        const expiresAt = localStorage.getItem(TIMER_KEY);
        if (expiresAt) {
            const remaining = Math.floor((+expiresAt - Date.now()) / 1000);
            if (remaining > 0) setSeconds(remaining);
            else localStorage.removeItem(TIMER_KEY);
        }
    }, []);

    useEffect(() => {
        if (seconds <= 0) return;
        const timer = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(timer);
    }, [seconds]);

    const onSubmit = async (data) => {
        if (loading) return;
        const res = await dispatch(verifyPhoneThunk(data));
        if (res?.meta?.requestStatus === "fulfilled") {
            router.push("/login"); // أو وجهه حيث تريد بعد التفعيل
        } else {
            toast.error(res?.payload?.msg || t("toasts.something_wrong"));
        }
    };

    const handleResend = async () => {
        const values = getValues();
        if (!values.phone || !values.country_code) {
            toast.error(t("validation.fill_phone_first"));
            return;
        }
        const res = await dispatch(resendCodeThunk({ country_code: values.country_code, phone: values.phone }));
        if (res?.meta?.requestStatus === "fulfilled") {
            toast.success(t("toasts.code_sent"));
            const expiresAt = Date.now() + 60 * 1000;
            localStorage.setItem(TIMER_KEY, expiresAt);
            setSeconds(60);
        }
    };

    return (
        <AuthLayout illustration="/assets/images/signin.svg">
            <h1 className="mb-2 h4">{t("verify.title")}</h1>
            <p className="mb-0">{t("verify.subtitle")}</p>

            <form className="mt-4 text-end" onSubmit={handleSubmit(onSubmit)}>
                <PhoneField register={register} errors={errors} control={control} defaultCode="+966" />

                <div className="mb-3">
                    <label className="form-label">{t("labels.code")}</label>
                    <input type="text" className="form-control" {...register("code")} />
                    {errors.code && <small className="text-danger">{errors.code.message}</small>}
                </div>

                {/* device_id مخفي */}
                <input type="hidden" {...register("device_id")} />

                {error && <div className="alert alert-danger mt-2">{error}</div>}
                {info && <div className="alert alert-success mt-2">{info}</div>}

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

                <div className="mb-3 text-center">
                    <p>{t("verify.back_to")} <Link href="/login">{t("links.login")}</Link></p>
                </div>

                <SubmitButton loading={loading} label={t("buttons.verify")} />
            </form>
        </AuthLayout>
    );
}
