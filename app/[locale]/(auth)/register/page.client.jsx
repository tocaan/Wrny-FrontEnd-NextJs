"use client";

import AuthLayout from "../auth-layout";
import PhoneField from "../components/PhoneField";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";
// import Link from "@/i18n/routing";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "@/store/slices/authThunks";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

const makeRegisterSchema = (t) =>
    z.object({
        name: z.string().min(2, t("validation.min_chars", { count: 2 })),
        email: z.string().email(t("validation.email")),
        country_code: z.string().min(1, t("validation.required")),
        phone: z.string().min(6, t("validation.phone")),
        password: z.string().min(6, t("validation.min_chars", { count: 6 })),
        password_confirmation: z.string().min(6, t("validation.min_chars", { count: 6 })),
        remember: z.boolean().optional(),
    }).refine((d) => d.password === d.password_confirmation, {
        message: t("validation.password_mismatch"),
        path: ["password_confirmation"],
    });

export default function RegisterClientPage() {
    const t = useTranslations("auth");
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading } = useSelector((s) => s.auth);

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        resolver: zodResolver(makeRegisterSchema(t)),
        defaultValues: { country_code: "+966", remember: true },
    });

    const onSubmit = async (data) => {
        if (loading) return;
        const res = await dispatch(registerThunk({ ...data, type: "individual" }));
        if (res?.meta?.requestStatus === "fulfilled") {
            router.push("/verify-phone");
        }
    };

    return (
        <AuthLayout illustration="/assets/images/signin.svg">
            <h1 className="mb-2 h4">{t("register.title")}</h1>
            <p className="mb-0">
                {t("register.have_account")} <Link href="/login">{t("links.login")}</Link>
            </p>

            <form className="mt-4 text-end" onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                    <label className="form-label">{t("labels.name")}</label>
                    <input type="text" className="form-control" {...register("name")} />
                    {errors.name && <small className="text-danger">{errors.name.message}</small>}
                </div>

                <div className="mb-3">
                    <label className="form-label">{t("labels.email")}</label>
                    <input type="email" className="form-control" {...register("email")} />
                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                </div>

                <PhoneField register={register} errors={errors} defaultCode="+966" />
                <PasswordField label={t("labels.password")} name="password" register={register} errors={errors} />
                <PasswordField label={t("labels.password_confirmation")} name="password_confirmation" register={register} errors={errors} />
                <SubmitButton loading={loading} label={t("buttons.register")} />
            </form>
        </AuthLayout>
    );
}
