"use client";

import AuthLayout from "../auth-layout";
import PhoneField from "../components/PhoneField";
import PasswordField from "../components/PasswordField";
import SubmitButton from "../components/SubmitButton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk } from "@/store/slices/authThunks";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { Link, useRouter } from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { useCountries } from "@/utils/countries";
import PhoneFieldIntl from "../components/PhoneFieldIntl";

const makeLoginSchema = (t) =>
    z.object({
        country_code: z.string().min(1, t("validation.required")),
        phone: z.string().min(6, t("validation.phone")),
        password: z.string().min(6, t("validation.min_chars", { count: 6 })),
        remember: z.boolean().optional(),
    });
export default function LoginClientPage() {
    const t = useTranslations("auth");
    const dispatch = useDispatch();
    const router = useRouter();
    const { loading } = useSelector((s) => s.auth);
    const search = useSearchParams();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(makeLoginSchema(t)),
        defaultValues: { country_code: "+966", remember: true },
    });

    const onSubmit = async (data) => {
        if (loading) return;
        const res = await dispatch(loginThunk(data));
        if (res?.meta?.requestStatus === "fulfilled") {
            const token = res.payload?.data?.token ?? res.payload?.token;
            if (token) {
                document.cookie = `auth_token=${token}; Max-Age=${30 * 24 * 60 * 60}; Path=/; SameSite=Lax`;
            }
            const next = search.get("next");
            router.push(next || "/");
        }
    };

    return (
        <AuthLayout illustration="/assets/images/signin.svg">
            <h1 className="mb-2 h4">{t("login.title")}</h1>
            <p className="mb-0">
                {t("login.new_here")} <Link href="/register">{t("links.register")}</Link>
            </p>

            <form className="mt-4 text-end" onSubmit={handleSubmit(onSubmit)}>
                <PhoneField register={register} errors={errors} setValue={setValue} defaultCode="+965" />
                <PasswordField label={t("labels.password")} name="password" register={register} errors={errors} />

                <div className="mb-3 d-sm-flex justify-content-between">
                    <div>
                        <input type="checkbox" className="form-check-input" id="rememberCheck" {...register("remember")} />
                        <label className="form-check-label" htmlFor="rememberCheck">{t("labels.remember_me_q")}</label>
                    </div>
                    <Link href="/forgot">{t("links.forgot_password")}</Link>
                </div>

                <SubmitButton loading={loading} label={t("buttons.login")} />
            </form>
        </AuthLayout>
    );
}
