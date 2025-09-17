"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAccountThunk, updateAccountThunk } from "@/store/slices/accountSlice";
import api from "@/utils/api";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import PhoneField from "../../(auth)/components/PhoneField";
import SubmitButton from "../../(auth)/components/SubmitButton";
import toast from "react-hot-toast";
import AccountSidebar from "../components/AccountSidebar";
import Breadcrumb from "@/components/Breadcrumb";
import RHFPhoneField from "../../(auth)/components/RHFPhoneField";

const makeSchema = (t) =>
    z.object({
        name: z.string().min(2, t("validation.min_chars", { count: 2 })),
        email: z.string().email(t("validation.email")),
        country_code: z.string().min(1, t("validation.required")),
        phone: z.string().min(6, t("validation.phone")),
    });

export default function ProfileClientPage() {
    const t = useTranslations("account");
    const y = useTranslations();
    const dispatch = useDispatch();
    const { profile, loadingProfile, updatingProfile } = useSelector(s => s.account);
    const isFetching = loadingProfile && !profile;
    const locale = useLocale();

    const [phoneChanged, setPhoneChanged] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [sendingOtp, setSendingOtp] = useState(false);
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [pendingFormData, setPendingFormData] = useState(null);

    const { register, handleSubmit, formState: { errors }, setValue, setError,
        clearErrors, watch, reset } = useForm({
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

    const checkPhoneChange = (values) => {
        const currentPhone = profile?.phone || "";
        const currentCountryCode = profile?.country_code ? `+${String(profile.country_code).replace(/\D+/g, "")}` : "+965";
        const newPhone = values.phone || "";
        const newCountryCode = values.country_code || "+965";
        
        return currentPhone !== newPhone || currentCountryCode !== newCountryCode;
    };

    const onSubmit = async (values) => {
        if (checkPhoneChange(values)) {
            setPendingFormData(values);
            setShowOtpVerification(true);
            await sendOtpForPhoneChange(values);
            return;
        }

        const res = await dispatch(updateAccountThunk(values));
        if (res?.meta?.requestStatus === "fulfilled") {
            toast.success(t("toasts.saved"));
        } else {
            const errorMsg = typeof res?.payload === 'string' ? res.payload : res?.payload?.msg || t("toasts.something_wrong");
            toast.error(errorMsg);
        }
    };

    const sendOtpForPhoneChange = async (values) => {
        setSendingOtp(true);
        try {
            const formData = new FormData();
            formData.append('country_code', values.country_code.replace('+', ''));
            formData.append('phone', values.phone);

            const response = await api.post("/change-phone-send-code", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data?.key === "success") {
                toast.success(response.data?.msg || t("otp.sent_success"));
            } else {
                toast.error(response.data?.msg || t("otp.send_failed"));
                setShowOtpVerification(false);
            }
        } catch (error) {
            const errorMsg = error?.response?.data?.message || error?.response?.data?.msg || t("otp.send_failed");
            toast.error(errorMsg);
            setShowOtpVerification(false);
        } finally {
            setSendingOtp(false);
        }
    };

    const verifyOtpAndUpdate = async () => {
        if (!otpCode || otpCode.length < 4) {
            toast.error(t("otp.code_required"));
            return;
        }

        setVerifyingOtp(true);
        try {
            
            const formData = new FormData();
            formData.append('code', otpCode);

            const verifyResponse = await api.post("/change-phone-check-code", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (verifyResponse.data?.key === "success") {
                const updateRes = await dispatch(updateAccountThunk(pendingFormData));
                if (updateRes?.meta?.requestStatus === "fulfilled") {
                    toast.success(t("toasts.phone_updated"));
                    setShowOtpVerification(false);
                    setOtpCode("");
                    setPendingFormData(null);
                } else {
                    const errorMsg = typeof updateRes?.payload === 'string' ? updateRes.payload : updateRes?.payload?.msg || t("toasts.something_wrong");
                    toast.error(errorMsg);
                }
            } else {
                toast.error(verifyResponse.data?.msg || t("otp.verify_failed"));
            }
        } catch (error) {
            toast.error(t("otp.verify_failed"));
        } finally {
            setVerifyingOtp(false);
        }
    };

    const cancelOtpVerification = () => {
        setShowOtpVerification(false);
        setOtpCode("");
        setPendingFormData(null);
        setSendingOtp(false);
        setVerifyingOtp(false);
    };

    return (
        <>
            {/* <Breadcrumb items={[{ name: t('nav.profile') }]} /> */}

            <section className="pt-3">
                <div className="container">
                    <div className="row">
                        <AccountSidebar active="profile" />
                        <div className="col-12 col-lg-4 col-xl-4">
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
                                                <div className="spinner-border" role="status" aria-label={y("common.loading")}></div>
                                                <div className="mt-2 small text-muted">{y("common.loading")}</div>
                                            </div>
                                        ) : (
                                            <>
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
                                                        <div className="mb-3 d-flex flex-column">
                                                            <label className="form-label">
                                                                {t("labels.phone")} <span className="text-danger">*</span>
                                                            </label>

                                                            <RHFPhoneField
                                                                setValue={setValue}
                                                                setError={setError}
                                                                clearErrors={clearErrors}
                                                                defaultValue={profile?.phone}
                                                                lang={locale}
                                                                watch={watch}
                                                                required
                                                            />

                                                            <input type="hidden" {...register("country_code")} />
                                                            <input type="hidden" {...register("phone")} />
                                                        </div>
                                                    </div>

                                                    <div className="col-12 text-end">
                                                        <SubmitButton loading={updatingProfile || sendingOtp} label={t("buttons.save_changes")} />
                                                    </div>
                                                </form>

                                                {/* OTP Verification Modal */}
                                                {showOtpVerification && (
                                                    <div className="card border-warning mt-4">
                                                        <div className="card-header bg-warning bg-opacity-10">
                                                            <h5 className="card-title mb-0">
                                                                <i className="bi bi-shield-check me-2"></i>
                                                                {t("otp.verify_phone_title")}
                                                            </h5>
                                                        </div>
                                                        <div className="card-body">
                                                            <p className="mb-3">
                                                                {t("otp.verify_phone_message", { 
                                                                    phone: `${pendingFormData?.country_code}${pendingFormData?.phone}` 
                                                                })}
                                                            </p>
                                                            
                                                            <div className="mb-3">
                                                                <label className="form-label">{t("otp.enter_code")}</label>
                                                                <input
                                                                    type="text"
                                                                    className="form-control text-center"
                                                                    placeholder="0000"
                                                                    value={otpCode}
                                                                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                                                    maxLength={6}
                                                                    disabled={verifyingOtp}
                                                                    dir="ltr"
                                                                />
                                                            </div>

                                                            <div className="d-flex gap-2 justify-content-end">
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-outline-secondary"
                                                                    onClick={cancelOtpVerification}
                                                                    disabled={verifyingOtp}
                                                                >
                                                                    {t("buttons.cancel")}
                                                                </button>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-outline-primary"
                                                                    onClick={() => sendOtpForPhoneChange(pendingFormData)}
                                                                    disabled={sendingOtp || verifyingOtp}
                                                                >
                                                                    {sendingOtp ? (
                                                                        <>
                                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                                            {t("otp.sending")}
                                                                        </>
                                                                    ) : (
                                                                        t("otp.resend")
                                                                    )}
                                                                </button>
                                                                <button 
                                                                    type="button" 
                                                                    className="btn btn-primary"
                                                                    onClick={verifyOtpAndUpdate}
                                                                    disabled={!otpCode || otpCode.length < 4 || verifyingOtp}
                                                                >
                                                                    {verifyingOtp ? (
                                                                        <>
                                                                            <span className="spinner-border spinner-border-sm me-1"></span>
                                                                            {t("otp.verifying")}
                                                                        </>
                                                                    ) : (
                                                                        t("otp.verify_and_save")
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
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