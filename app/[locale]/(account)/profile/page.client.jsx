"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountThunk, updateAccountThunk } from "@/store/slices/accountSlice";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import PhoneField from "../../(auth)/components/PhoneField";
import SubmitButton from "../../(auth)/components/SubmitButton";
import toast from "react-hot-toast";
import AccountSidebar from "../components/AccountSidebar";
import Breadcrumb from "@/components/Breadcrumb";

const makeSchema = (t) =>
    z.object({
        name: z.string().min(2, t("validation.min_chars", { count: 2 })),
        email: z.string().email(t("validation.email")),
        country_code: z.string().min(1, t("validation.required")),
        phone: z.string().min(6, t("validation.phone")),
    });

export default function ProfileClientPage() {
    const t = useTranslations("account");
    const dispatch = useDispatch();
    const { profile, loadingProfile, updatingProfile } = useSelector(s => s.account);
    const isFetching = loadingProfile && !profile;

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: zodResolver(makeSchema(t)),
        defaultValues: {
            name: "",
            email: "",
            country_code: "+965",
            phone: "",
        },
    });

    useEffect(() => {
        dispatch(fetchAccountThunk());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || "",
                email: profile.email || "",
                country_code: profile.country_code ? `+${String(profile.country_code).replace(/\D+/g, "")}` : "+966",
                phone: profile.phone || "",
            });
        }
    }, [profile, reset]);

    const onSubmit = async (values) => {
        const res = await dispatch(updateAccountThunk(values));
        if (res?.meta?.requestStatus === "fulfilled") {
            toast.success(t("toasts.saved"));
        } else {
            toast.error(res?.payload || t("toasts.something_wrong"));
        }
    };

    // if (isFetching) {
    //     return <div className="container py-5 text-center">جاري التحميل ..</div>;
    // }

    return (
        <>
            <Breadcrumb items={[{ name: t('nav.profile') }]} />

            <section className="pt-3">
                <div className="container">
                    <div className="row">
                        <AccountSidebar active="profile" />
                        <div className="col-lg-8 col-xl-9">
                            <div className="d-grid mb-0 d-lg-none w-100">
                                <button className="btn btn-primary mb-4" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                                    <i className="fas fa-sliders-h" /> {t("nav.menu")}
                                </button>
                            </div>

                            <div className="vstack gap-4">
                                <div className="card border">
                                    <div className="card-header border-bottom">
                                        <h4 className="card-header-title">{t("profile.title")}</h4>
                                    </div>

                                    <div className="card-body">
                                        {isFetching ? (
                                            <div className="py-5 text-center">
                                                <div className="spinner-border" role="status" aria-label={t("misc.loading")}></div>
                                                <div className="mt-2 small text-muted">{t("misc.loading")}</div>
                                            </div>
                                        ) : (
                                            <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
                                                <div className="col-md-12">
                                                    <label className="form-label">
                                                        {t("labels.name")}<span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder={t("placeholders.name")}
                                                        {...register("name")}
                                                    />
                                                    {errors.name && <small className="text-danger">{errors.name.message}</small>}
                                                </div>

                                                <div className="col-md-12">
                                                    <label className="form-label">
                                                        {t("labels.email")}<span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        placeholder={t("placeholders.email")}
                                                        {...register("email")}
                                                    />
                                                    {errors.email && <small className="text-danger">{errors.email.message}</small>}
                                                </div>

                                                <div className="col-md-12">
                                                    <PhoneField
                                                        register={register}
                                                        errors={errors}
                                                        defaultCode={
                                                            profile?.country_code
                                                                ? `+${String(profile.country_code).replace(/\D+/g, "")}`
                                                                : "+965"
                                                        }
                                                        setValue={setValue}
                                                        watch={watch}
                                                    />
                                                </div>

                                                <div className="col-12 text-end">
                                                    <SubmitButton loading={updatingProfile} label={t("buttons.save_changes")} />
                                                </div>
                                            </form>
                                        )}

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
