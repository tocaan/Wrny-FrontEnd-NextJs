"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Breadcrumb from "@/components/Breadcrumb";
import {
    fetchBranchDetails,
    selectCurrentBranch,
    selectBranchLoading,
    selectBranchError,
} from "@/store/slices/branchSlice";
import {
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaIdCard,
    FaFacebookF,
    FaTwitter,
    FaInstagram,
    FaLinkedinIn,
    FaYoutube,
    FaTiktok,
    FaSnapchatGhost,
} from "react-icons/fa";
import GlobalLoader from "@/components/GlobalLoader";

/* ================= Helpers ================= */
const SOCIAL_MAP = {
    فيسبوك: { icon: <FaFacebookF className="text-white" />, color: "facebook" },
    إنستغرام: {
        icon: <FaInstagram className="text-white" />,
        color: "instagram",
    },
    "تيك توك": { icon: <FaTiktok className="text-white" />, color: "tiktok" },
    "إكس (تويتر)": {
        icon: <FaTwitter className="text-white" />,
        color: "twitter",
    },
    يوتيوب: { icon: <FaYoutube className="text-white" />, color: "youtube" },
    "سناب شات": {
        icon: <FaSnapchatGhost className="text-black" />,
        color: "snapchat",
    },
    Facebook: { icon: <FaFacebookF className="text-white" />, color: "facebook" },
    Instagram: {
        icon: <FaInstagram className="text-white" />,
        color: "instagram",
    },
    TikTok: { icon: <FaTiktok className="text-white" />, color: "tiktok" },
    "X (Twitter)": {
        icon: <FaTwitter className="text-white" />,
        color: "twitter",
    },
    YouTube: { icon: <FaYoutube className="text-white" />, color: "youtube" },
    Snapchat: {
        icon: <FaSnapchatGhost className="text-black" />,
        color: "snapchat",
    },
    LinkedIn: {
        icon: <FaLinkedinIn className="text-white" />,
        color: "linkedin",
    },
};

function getSocialMediaInfo(name) {
    if (!name) return { icon: <FaGlobe />, color: "primary" };
    const key = Object.keys(SOCIAL_MAP).find(
        (k) => k.toLowerCase() === String(name).toLowerCase()
    );
    return SOCIAL_MAP[key] || { icon: <FaGlobe />, color: "primary" };
}

/* ================= UI ================= */
const Header = ({ branch, t, y }) => (
    <div className="card bg-light p-0 pb-0">
        <div className="card-body d-flex justify-content-between flex-wrap">
            <div className="d-flex justify-content-between align-items-center">
                <div className="mx-2">
                    <div className="avatar avatar-xl logo-branch">
                        <img
                            className="avatar-img rounded-2"
                            src={branch?.logo || "/placeholder-logo.png"}
                            alt={branch?.name || t("common.branch")}
                        />
                    </div>
                </div>
                <div>
                    <h1 className="h4 mt-2 mb-2">
                        {branch?.name || t("common.loading")}
                    </h1>
                    <p className="mb-2 mb-sm-0">
                        <FaMapMarkerAlt className="mx-1 text-primary" />
                        {branch?.address || t("common.noAddress")}
                    </p>
                </div>
            </div>
            <ul className="list-inline mb-0">
                <li class="list-inline-item">
                    {branch?.is_active ? (
                        <span className="text-success bg-success bg-opacity-10 px-2 rounded-1 fw-600">
                            {y("common.opened")}
                        </span>
                    ) : (
                        <span className="text-danger bg-danger bg-opacity-10 px-2 rounded-1 fw-600">
                            {y("common.closed")}
                        </span>
                    )}
                </li>
            </ul>
        </div>
    </div>
);

const LocationMap = ({ branch, t }) => {
    const mapUrl = useMemo(() => {
        const lat = branch?.lat;
        const lng = branch?.lng;
        if (!lat || !lng) return null;
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3478.821428591848!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcff6c640d622e1%3A0x6a34709e9d0a1d3c!2z2LfYsdmK2YLYjCDYp9mE2KzZh9ix2KfYodiMINin2YTZg9mI2YrYquKAjg!5e0!3m2!1sar!2seg!4v1751869544033!5m2!1sar!2seg`;
    }, [branch?.lat, branch?.lng]);

    if (!mapUrl) {
        return (
            <div className="card shadow mb-4">
                <div className="card-header border-bottom">
                    <h5 className="mb-0">{t("branch.location")}</h5>
                </div>
                <div className="card-body">
                    <p className="mb-3">
                        <FaMapMarkerAlt className="mx-1 text-primary" />
                        {branch?.address || t("common.noAddress")}
                    </p>
                    <div className="alert alert-warning">
                        {t("errors.noLocationData")}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow mb-4">
            <div className="card-header border-bottom">
                <h5 className="mb-0">{t("branch.location")}</h5>
            </div>
            <div className="card-body">
                <p className="mb-3">
                    <FaMapMarkerAlt className="mx-1 text-primary" />
                    {branch?.address}
                </p>
                <iframe
                    src={mapUrl}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={t("branch.locationMap")}
                />
            </div>
        </div>
    );
};

const ContactInfo = ({ branch, t }) => {
    const hasSocial =
        Array.isArray(branch?.social_media) && branch.social_media.length > 0;

    return (
        <div className="card shadow mb-4">
            <div className="card-header border-bottom">
                <h5 className="mb-0">{t("branch.contactInfo")}</h5>
            </div>
            <div className="card-body">
                <ul className="list-group list-group-borderless my-3">
                    <li className="list-group-item">
                        <span className="h6 fs-14 fw-normal mb-0">
                            <FaMapMarkerAlt className="mx-1 text-primary" />
                            {branch?.address || t("common.noAddress")}
                        </span>
                    </li>

                    {!!branch?.contact_phone && (
                        <li className="list-group-item">
                            <a
                                href={`tel:${branch.contact_phone}`}
                                className="h6 fs-14 fw-normal mb-0"
                            >
                                <FaPhone className="mx-1 text-primary" />
                                <span dir="ltr">{branch.contact_phone}</span>
                            </a>
                        </li>
                    )}

                    {!!branch?.contact_email && (
                        <li className="list-group-item">
                            <a
                                href={`mailto:${branch.contact_email}`}
                                className="h6 fs-14 fw-normal mb-0"
                            >
                                <FaEnvelope className="mx-1 text-primary" />
                                {branch.contact_email}
                            </a>
                        </li>
                    )}

                    {!!branch?.website_url && (
                        <li className="list-group-item">
                            <a
                                href={branch.website_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h6 fs-14 fw-normal mb-0"
                            >
                                <FaGlobe className="mx-1 text-primary" />
                                {branch.website_url}
                            </a>
                        </li>
                    )}

                    <li className="list-group-item">
                        <span className="h6 fs-14 fw-normal mb-0">
                            <FaIdCard className="mx-1 text-primary" />
                            {branch?.license_number || t("common.noLicense")}
                        </span>
                    </li>
                </ul>

                {hasSocial && (
                    <>
                        <p className="mt-3 mb-2">{t("branch.socialMedia")}</p>
                        <ul className="list-inline mb-0">
                            {branch.social_media.map((social) => {
                                if (!social?.url) return null;
                                const s = getSocialMediaInfo(social?.name);
                                return (
                                    <li key={social.id} className="list-inline-item">
                                        <a
                                            className={`btn btn-sm shadow px-2 bg-${s.color} mb-0 text-white`}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.name}
                                        >
                                            {s.icon}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
};

const WorkingHours = ({ branch, t }) => (
    <div className="card shadow mb-4">
        <div className="card-header border-bottom">
            <h5 className="mb-0">{t("branch.workingHours")}</h5>
        </div>
        <div className="card-body">
            <ul className="list-group list-group-borderless mb-0">
                {branch?.working_hours?.map((hour, i, arr) => (
                    <div key={`${hour?.day || "d"}-${i}`}>
                        <li className="list-group-item d-flex justify-content-between">
                            <span>{hour?.day || "-"}</span>
                            <span>
                                {hour?.isClosed
                                    ? t("branch.closed")
                                    : `${hour?.from || "-"} - ${hour?.to || "-"}`}
                            </span>
                        </li>
                        {i < (arr?.length || 0) - 1 && (
                            <li className="list-group-item py-0">
                                <hr className="my-1" />
                            </li>
                        )}
                    </div>
                ))}
            </ul>
        </div>
    </div>
);

const ErrorState = ({ error, t }) => (
    <div className="alert alert-danger" role="alert">
        {error || t("errors.general")}
    </div>
);

/* ================= Page ================= */
export default function BranchDetails() {
    const params = useParams(); // يدعم string | string[]
    const id = useMemo(() => {
        const raw = Array.isArray(params?.id) ? params.id[0] : params?.id;
        return raw ?? null;
    }, [params]);

    const dispatch = useDispatch();

    // استخدم selectors من الـ slice (كاش + حالة تحميل موحّدة)
    const branch = useSelector(selectCurrentBranch);
    const loading = useSelector(selectBranchLoading);
    const error = useSelector(selectBranchError);

    const t = useTranslations("pages");
    const y = useTranslations();

    // جلب البيانات عند تغيّر الـ id (الـ thunk نفسه بيمنع التكرار وبيكنسل القديم)
    useEffect(() => {
        if (id) dispatch(fetchBranchDetails(id));
    }, [dispatch, id]);

    // عنوان الصفحة
    useEffect(() => {
        document.title = branch?.name
            ? `${branch.name} - ${t("app.title")}`
            : t("page_titles.branches");
    }, [branch?.name, t]);

    if (loading) return <GlobalLoader />;
    if (error) return <ErrorState error={error} t={t} />;

    return (
        <div>
            <Breadcrumb
                items={[
                    { name: y("breadcrumb.companies"), href: "/companies" },
                    { name: branch?.name || y("common.loading") },
                ]}
            />

            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <Header branch={branch} t={t} y={y} />
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container">
                    <div className="row g-4 g-lg-5">
                        <div className="col-lg-7 col-xl-8">
                            <LocationMap branch={branch} t={t} />
                        </div>
                        <div className="col-lg-5 col-xl-4">
                            <ContactInfo branch={branch} t={t} />
                            <WorkingHours branch={branch} t={t} />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
