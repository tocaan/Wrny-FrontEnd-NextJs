"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumb";
import CategoryCard from "@/components/CategoryCard";
import CompanyCard from "@/components/CompanyCard";
import EventSideCard from "@/components/EventSideCard";
import Pagination from "@/components/Pagination";
import SwiperSlider from "@/components/ui/SwiperSlider";

import {
    fetchCategories,
    selectCategoriesForLocale,
    selectCategoriesStatus,
} from "@/store/slices/categoriesSlice";

import {
    fetchCompanies,
    selectCompaniesEntry,
    selectCompaniesList,
    selectCompaniesStatus,
} from "@/store/slices/companiesSlice";

import {
    fetchEvents,
    selectEventsEntry,
    selectEventsList,
    selectEventsStatus,
} from "@/store/slices/eventsSlice";

import {
    BreadcrumbSkeleton,
    CategoriesSkeleton,
    CompaniesListSkeleton,
    CardSkeleton,
} from "@/components/ui/Skeletons";
import CompaniesCategorySection from "@/components/sections/CompaniesCategorySection";
import EmptyState from "@/components/ui/EmptyState";
import InboxIllustration from "@/components/ui/illustrations/InboxIllustration";

export default function CategoryDetailsPage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { id: idParam } = useParams();
    const locale = useLocale();
    const t = useTranslations();

    const currentLang = useMemo(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("LANG");
            if (saved) return saved;
        }
        return (locale || "en").startsWith("ar") ? "ar" : "en";
    }, [locale]);

    const activeCategoryId = useMemo(() => {
        const n = Number(idParam);
        return Number.isFinite(n) && n > 0 ? n : null;
    }, [idParam]);

    useEffect(() => {
        dispatch(fetchCategories(currentLang));
    }, [dispatch, currentLang]);

    const categories = useSelector(selectCategoriesForLocale(currentLang));
    const categoriesStatus = useSelector(selectCategoriesStatus);
    const categoriesLoading = categoriesStatus === "pending";
    const activeCategoryName =
        categories.find((c) => Number(c.id) === Number(activeCategoryId))?.name ||
        null;

    const companiesParams = useMemo(
        () => ({
            page: 1,
            locale: currentLang,
            filters: activeCategoryId ? { category_id: activeCategoryId } : {},
        }),
        [currentLang, activeCategoryId]
    );

    useEffect(() => {
        dispatch(fetchCompanies(companiesParams));
    }, [dispatch, companiesParams]);

    const companiesEntry = useSelector(selectCompaniesEntry(companiesParams));
    const companies = useSelector(selectCompaniesList(companiesParams));
    const companiesStatus = useSelector(selectCompaniesStatus(companiesParams));
    const companiesLoading = companiesStatus === "pending" && !companiesEntry;
    const companiesUpdating = companiesStatus === "pending" && !!companiesEntry;

    const [eventsPage, setEventsPage] = useState(1);

    useEffect(() => {
        setEventsPage(1);
    }, [activeCategoryId]);

    const eventsParams = useMemo(
        () => ({
            page: eventsPage,
            locale: currentLang,
            filters: activeCategoryId ? { category_id: activeCategoryId } : {},
        }),
        [currentLang, activeCategoryId, eventsPage]
    );

    useEffect(() => {
        dispatch(fetchEvents(eventsParams));
    }, [dispatch, eventsParams]);

    const eventsEntry = useSelector(selectEventsEntry(eventsParams));
    const events = useSelector(selectEventsList(eventsParams));
    const eventsStatus = useSelector(selectEventsStatus(eventsParams));
    const eventsLoading = eventsStatus === "pending" && !eventsEntry;
    const eventsUpdating = eventsStatus === "pending" && !!eventsEntry;

    const eventsMeta =
        eventsEntry?.pagination || {
            current_page: eventsPage,
            last_page: 1,
            total: events.length,
            per_page: events.length || 12,
        };

    const handleEventsPageChange = (p) => {
        setEventsPage(p);
        try {
            window?.scrollTo?.({ top: 0, behavior: "smooth" });
        } catch { }
    };

    const handleSelectCategory = useCallback(
        (nextId) => {
            router.push(`/${locale}/categories/${nextId}`, { scroll: false });
        },
        [router, locale]
    );

    const displayCatName =
        activeCategoryName || t("pages.categories.all_categories");

    const companiesTitle = t('pages.categories.top_companies_with_name', { name: displayCatName });
    const eventsTitle = t('pages.categories.best_places_with_name', { name: displayCatName });

    useEffect(() => {
        if (displayCatName) {
            document.title = `${displayCatName} - ${t("app.title")}`;
        } else {
            document.title = t("pages.categories.all_categories");
        }
    }, [displayCatName, t]);


    return (
        <div>
            {categoriesLoading && !activeCategoryName ? (
                <BreadcrumbSkeleton />
            ) : (
                <Breadcrumb
                    items={[
                        { name: t("breadcrumb.categories"), href: `/${locale}/categories` },
                        {
                            name:
                                activeCategoryName || t("pages.categories.all_categories"),
                        },
                    ]}
                />
            )}

            <section className="categories">
                <div className="container">
                    {categoriesLoading && categories.length === 0 ? (
                        <CategoriesSkeleton />
                    ) : (
                        <div
                            className="categories-slider"
                            aria-busy={categoriesLoading}
                        >
                            <SwiperSlider
                                key={`cats-${categories.length}`}
                                uniqueId="categories-filter"
                                data={categories}
                                renderItem={(category) => {
                                    const isActive =
                                        Number(category.id) === Number(activeCategoryId);
                                    return (
                                        <div
                                            role="button"
                                            onClick={() => handleSelectCategory(category.id)}
                                            className={isActive ? "ring-2 ring-primary" : ""}
                                            data-active={isActive ? "true" : "false"}
                                        >
                                            <CategoryCard category={category} isActive={isActive} />
                                        </div>
                                    );
                                }}
                                options={{
                                    spaceBetween: 16,
                                    autoplay: false,
                                    loop: false,
                                    breakpoints: {
                                        0: { slidesPerView: 2 },
                                        576: { slidesPerView: 3 },
                                        768: { slidesPerView: 4 },
                                        992: { slidesPerView: 5 },
                                        1200: { slidesPerView: 6 },
                                    },
                                }}
                                showNavigation={true}
                                showPagination={false}
                                className="categories-swiper"
                            />
                        </div>
                    )}
                </div>
            </section>

            {companies.length > 0 && (
                <CompaniesCategorySection companiesData={companies} title={companiesTitle} />
            )}

            <section className="pt-4">
                <div className="container" aria-busy={eventsUpdating}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h3 className="h5 mb-0">{eventsTitle}</h3>
                    </div>

                    {eventsLoading && events.length === 0 ? (
                        <CompaniesListSkeleton />
                    ) : events.length > 0 ? (
                        <>
                            <div className="row g-4">
                                {events.map((ev) => (
                                    <div key={ev.id} className="col-12 col-md-6 col-xl-3">
                                        <EventSideCard event={ev} />
                                    </div>
                                ))}
                            </div>

                            <div className="row mt-4">
                                <div className="col-12">
                                    <Pagination
                                        meta={eventsMeta}
                                        onPageChange={handleEventsPageChange}
                                    />
                                </div>
                            </div>
                        </>
                    ) : null}
                </div>
            </section>

            {!companiesLoading && !eventsLoading && companies.length === 0 && events.length === 0 && (
                <section className="py-5">
                    <div className="container">
                        <EmptyState
                            title={t('pages.categories.no_items_title') || 'لا توجد عناصر في هذه الفئة'}
                            description={t('pages.categories.no_items_description', { 
                                categoryName: activeCategoryName || t('pages.categories.this_category') || 'هذه الفئة' 
                            }) || `لم نجد أي شركات أو أحداث في ${activeCategoryName || 'هذه الفئة'} حالياً.`}
                            illustration={<InboxIllustration />}
                            actions={[
                                { 
                                    label: t('common.refresh') || 'تحديث', 
                                    variant: 'outline', 
                                    onClick: () => {
                                        dispatch(fetchCompanies(companiesParams));
                                        dispatch(fetchEvents(eventsParams));
                                    }
                                },
                                { 
                                    label: t('pages.categories.browse_all') || 'تصفح جميع الفئات', 
                                    href: `/${locale}/categories`, 
                                    variant: 'primary' 
                                },
                            ]}
                            size="lg"
                        />
                    </div>
                </section>
            )}
        </div>
    );
}
