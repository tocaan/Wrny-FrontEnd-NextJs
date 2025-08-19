"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "next/navigation";
import { fetchCompanyDetails } from "@/store/slices/companySlice";
import { fetchCompanyBranches } from "@/store/slices/branchesSlice";
import Breadcrumb from "@/components/Breadcrumb";
import { useTranslations } from "next-intl";
import {
    FaFacebookF,
    FaInstagram,
    FaTiktok,
    FaTwitter,
    FaYoutube,
    FaSnapchatGhost,
    FaMapMarkerAlt,
    FaPhone,
    FaEnvelope,
    FaGlobe,
    FaIdCard,
    FaHeart,
    FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "@/i18n/routing";
import BranchCard from "@/components/BranchCard";
import Loading from "@/components/GlobalLoader";
import { CompanyDetailsSkeleton } from "@/components/ui/Skeletons";
import Pagination from "@/components/Pagination";

function getSocialMediaInfo(name) {
    const socialMediaMap = {
        "فيسبوك": { icon: <FaFacebookF className="text-white" />, color: "facebook" },
        "إنستغرام": { icon: <FaInstagram className="text-white" />, color: "instagram" },
        "تيك توك": { icon: <FaTiktok className="text-white" />, color: "tiktok" },
        "إكس (تويتر)": { icon: <FaTwitter className="text-white" />, color: "twitter" },
        "يوتيوب": { icon: <FaYoutube className="text-white" />, color: "youtube" },
        "سناب شات": { icon: <FaSnapchatGhost className="text-black" />, color: "snapchat" },
        Facebook: { icon: <FaFacebookF className="text-white" />, color: "facebook" },
        Instagram: { icon: <FaInstagram className="text-white" />, color: "instagram" },
        TikTok: { icon: <FaTiktok className="text-white" />, color: "tiktok" },
        "X (Twitter)": { icon: <FaTwitter className="text-white" />, color: "twitter" },
        YouTube: { icon: <FaYoutube className="text-white" />, color: "youtube" },
        Snapchat: { icon: <FaSnapchatGhost className="text-black" />, color: "snapchat" },
        LinkedIn: { icon: <FaLinkedinIn className="text-white" />, color: "linkedin" },
    };
    const key = Object.keys(socialMediaMap).find(
        (k) => k.toLowerCase() === String(name).toLowerCase()
    );
    return socialMediaMap[key] || { icon: <FaGlobe />, color: "primary" };
}

export default function CompanyDetailsPageClient() {
    const dispatch = useDispatch();
    const params = useParams();

    const companyId = useMemo(() => {
        const raw = Array.isArray(params?.id) ? params.id[0] : params?.id;
        return raw ?? null;
    }, [params]);

    const { company, loading: companyLoading } = useSelector((s) => s.company);
    const { branches, loading: branchesLoading, error: branchesError, pagination } = useSelector(
        (s) => s.branches
    );
    const t = useTranslations();

    const [activeTab, setActiveTab] = useState("tab-1");

    const loadedCompaniesRef = useRef(new Set());
    const fetchedCompanyOnceRef = useRef(false);

    useEffect(() => {
        if (!companyId) return;
        if (fetchedCompanyOnceRef.current) return;
        fetchedCompanyOnceRef.current = true;
        dispatch(fetchCompanyDetails(companyId));
    }, [dispatch, companyId]);

    useEffect(() => {
        if (company?.name) {
            document.title = `${company.name} - ${t("app.title")}`;
        } else {
            document.title = t("page_titles.companies");
        }
    }, [company?.name, t]);

    const loadBranches = (page = 1) => {
        if (!companyId) return;
        if (!loadedCompaniesRef.current.has(companyId) || page !== (pagination?.current_page || 1)) {
            dispatch(fetchCompanyBranches({ companyId, page }));
            loadedCompaniesRef.current.add(companyId);
        }
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        if (tabId === "tab-2") {
            if (!branches?.length) loadBranches(1);
        }
    };

    const handlePageChange = (page) => {
        loadBranches(page);
        try {
            window?.scrollTo?.({ top: 0, behavior: "smooth" });
        } catch { }
    };

    if (companyLoading) return <CompanyDetailsSkeleton />;

    if (!company) return <CompanyDetailsSkeleton />;

    return (
        <div>
            {/* <Breadcrumb
                items={[
                    { name: t("breadcrumb.companies"), href: "/companies" },
                    { name: company.name },
                ]}
            /> */}

            <section>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="card bg-light p-0 pb-0">
                                <div className="card-body d-flex justify-content-between flex-wrap">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="mx-2">
                                            <div className="avatar avatar-xl logo-company">
                                                <img className="avatar-img rounded-2" src={company.logo_url} alt={company.name} />
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className="h4 mt-2 mb-2">{company.name}</h1>
                                            <p className="mb-2 mb-sm-0">
                                                <FaMapMarkerAlt className="mx-1 text-primary" />
                                                {company.address}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="list-inline mb-0">
                                        <li className="list-inline-item heart-icon">
                                            <button className="btn btn-sm btn-white px-2" aria-label={t("actions.favorite")}>
                                                {company.is_favorited ? <FaHeart className="text-danger" /> : <FaHeart className="text-black" />}
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                <div className="card-footer bg-transparent border-top py-0">
                                    <ul className="nav nav-tabs nav-bottom-line nav-responsive border-0" role="tablist">
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link mb-0 ${activeTab === "tab-1" ? "active" : ""}`}
                                                onClick={() => handleTabChange("tab-1")}
                                            >
                                                {t('common.aboutCompany')}
                                            </button>
                                        </li>
                                        <li className="nav-item">
                                            <button
                                                className={`nav-link mb-0 ${activeTab === "tab-2" ? "active" : ""}`}
                                                onClick={() => handleTabChange("tab-2")}
                                            >
                                                {t('pages.companies.branches')}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pt-0">
                <div className="container">
                    <div className="tab-content mb-0" id="tour-pills-tabContent">

                        <div className={`tab-pane fade ${activeTab === "tab-1" ? "show active" : ""}`} id="tab-1" role="tabpanel">
                            <div className="row g-4 g-lg-5">
                                <div className="col-lg-7 col-xl-8">
                                    <div className="card shadow mb-4">
                                        <div className="card-header bg-transparent border-bottom">
                                            <h4 className="h5 mb-0">{t('common.aboutCompany')}</h4>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-3">{company.description}</p>
                                        </div>
                                    </div>

                                    <div className="card shadow mb-4">
                                        <div className="card-header border-bottom">
                                            <h5 className="mb-0">{t('common.location')}</h5>
                                        </div>
                                        <div className="card-body">
                                            <p className="mb-3">
                                                <FaMapMarkerAlt className="mx-1 text-primary" />
                                                {company.address}
                                            </p>
                                            {company?.lat && company?.lng ? (
                                                <iframe
                                                    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3478.821428591848!2d${company.lng}!3d${company.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcff6c640d622e1%3A0x6a34709e9d0a1d3c!2z2LfYsdmK2YLYjCDYp9mE2KzZh9ix2KfYodiMINin2YTZg9mI2YrYquKAjg!5e0!3m2!1sar!2seg!4v1751869544033!5m2!1sar!2seg`}
                                                    width="100%"
                                                    height="300"
                                                    style={{ border: 0 }}
                                                    allowFullScreen=""
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    title="company-location"
                                                />
                                            ) : (
                                                <div className="alert alert-warning mb-0">{t('common.noLocation')}</div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-5 col-xl-4">
                                    <div className="card shadow mb-4">
                                        <div className="card-header border-bottom">
                                            <h5 className="mb-0">{t('common.contactInfo')}</h5>
                                        </div>
                                        <div className="card-body">
                                            <ul className="list-group list-group-borderless my-3">
                                                <li className="list-group-item">
                                                    <span className="h6 fs-14 fw-normal mb-0">
                                                        <FaMapMarkerAlt className="mx-1 text-primary" />
                                                        {company.address}
                                                    </span>
                                                </li>
                                                {!!company?.phone && (
                                                    <li className="list-group-item">
                                                        <a href={`tel:${company.country_code || ""}${company.phone}`} className="h6 fs-14 fw-normal mb-0">
                                                            <FaPhone className="mx-1 text-primary" />
                                                            <span dir="ltr">
                                                                +{company.country_code} {company.phone}
                                                            </span>
                                                        </a>
                                                    </li>
                                                )}
                                                {!!company?.contact_email && (
                                                    <li className="list-group-item">
                                                        <a href={`mailto:${company.contact_email}`} className="h6 fs-14 fw-normal mb-0">
                                                            <FaEnvelope className="mx-1 text-primary" />
                                                            {company.contact_email}
                                                        </a>
                                                    </li>
                                                )}
                                                {!!company?.website_url && (
                                                    <li className="list-group-item">
                                                        <a href={company.website_url} target="_blank" rel="noopener noreferrer" className="h6 fs-14 fw-normal mb-0">
                                                            <FaGlobe className="mx-1 text-primary" />
                                                            {company.website_url}
                                                        </a>
                                                    </li>
                                                )}
                                                <li className="list-group-item">
                                                    <span className="h6 fs-14 fw-normal mb-0">
                                                        <FaIdCard className="mx-1 text-primary" />
                                                        {company.license_number}
                                                    </span>
                                                </li>
                                            </ul>

                                            {Array.isArray(company?.social_media) && company.social_media.length > 0 && (
                                                <>
                                                    <p className="mt-3 mb-2">{t('common.socialMedia')}</p>
                                                    <ul className="list-inline mb-0">
                                                        {company.social_media.map((social) => {
                                                            if (!social?.url) return null;
                                                            const socialInfo = getSocialMediaInfo(social.name);
                                                            return (
                                                                <li key={social.id} className="list-inline-item">
                                                                    <a
                                                                        className={`btn btn-sm shadow px-2 bg-${socialInfo.color} mb-0 text-white`}
                                                                        href={social.url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        aria-label={social.name}
                                                                    >
                                                                        {socialInfo.icon}
                                                                    </a>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card shadow mb-4">
                                        <div className="card-header border-bottom">
                                            <h5 className="mb-0">{t('common.workingHours')}</h5>
                                        </div>
                                        <div className="card-body">
                                            <ul className="list-group list-group-borderless mb-0">
                                                {company?.working_hours?.map((hour, index, arr) => (
                                                    <div key={`${hour?.day || "d"}-${index}`}>
                                                        <li className="list-group-item d-flex justify-content-between">
                                                            <span>{hour?.day || "-"}</span>
                                                            <span>{hour?.isClosed ? "أجازة أسبوعية" : `${hour?.from || "-"} - ${hour?.to || "-"}`}</span>
                                                        </li>
                                                        {index < (arr?.length || 0) - 1 && (
                                                            <li className="list-group-item py-0">
                                                                <hr className="my-1" />
                                                            </li>
                                                        )}
                                                    </div>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`tab-pane fade ${activeTab === "tab-2" ? "show active" : ""}`} id="tab-2" role="tabpanel">
                            {branchesLoading ? (
                                <Loading />
                            ) : branchesError ? (
                                <div className="text-center py-5 text-danger">{branchesError}</div>
                            ) : (
                                <>
                                    <div className="row g-4">
                                        {(branches || []).map((branch) => (
                                            <BranchCard key={branch.id} branch={branch} companyId={companyId} />
                                        ))}
                                    </div>
                                    {pagination && (
                                        <Pagination meta={pagination} onPageChange={handlePageChange} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
