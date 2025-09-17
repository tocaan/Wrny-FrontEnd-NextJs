"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";

import Breadcrumb from "@/components/Breadcrumb";
import CategoryCard from "@/components/CategoryCard";
import EventSideCard from "@/components/EventSideCard";
import Pagination from "@/components/Pagination";
import SwiperSlider from "@/components/ui/SwiperSlider";
import EmptyState from "@/components/ui/EmptyState";
import InboxIllustration from "@/components/ui/illustrations/InboxIllustration";

import {
  BreadcrumbSkeleton,
  CategoriesSkeleton,
  CompaniesListSkeleton,
} from "@/components/ui/Skeletons";

import {
  fetchEvents,
  selectEventsEntry,
  selectEventsList,
  selectEventsStatus,
} from "@/store/slices/eventsSlice";


import {
  fetchCountries,
  fetchRegionsByCountry,
  selectCountries,
  selectRegionsForCountry,
  selectRegionsStatus,
} from "@/store/slices/regionsSlice";
import RegionCard from "@/components/RegionCard";

export default function GovernmentDetailsPage() {
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


  const regionId = useMemo(() => {
    const n = Number(idParam);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [idParam]);


  const defaultCountryId = 117;

  useEffect(() => {
    if (defaultCountryId) {
      dispatch(fetchRegionsByCountry(defaultCountryId));
    }
  }, [dispatch, defaultCountryId]);

  const regions = useSelector(selectRegionsForCountry(defaultCountryId || ""));
  const regionsStatus = useSelector(selectRegionsStatus(defaultCountryId || ""));
  const regionsLoading = regionsStatus === "pending" && regions.length === 0;

  const [eventsPage, setEventsPage] = useState(1);

  useEffect(() => {
    setEventsPage(1);
  }, [regionId]);

  const eventsParams = useMemo(
    () => ({
      page: eventsPage,
      locale: currentLang,
      filters: regionId ? { "region_ids[]": regionId } : {},
    }),
    [currentLang, eventsPage, regionId]
  );

  useEffect(() => {
    dispatch(fetchEvents(eventsParams));
  }, [dispatch, eventsParams]);

  const eventsEntry = useSelector(selectEventsEntry(eventsParams));
  const events = useSelector(selectEventsList(eventsParams));
  const eventsStatusVal = useSelector(selectEventsStatus(eventsParams));
  const eventsLoading = eventsStatusVal === "pending" && !eventsEntry;
  const eventsUpdating = eventsStatusVal === "pending" && !!eventsEntry;

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
    } catch {}
  };

  useEffect(() => {
    document.title = t("page_titles.regions");
  }, [t]);

  const handleSelectRegion = useCallback(
    (nextRegionId) => {
      router.push(`/${locale}/governorate/${nextRegionId}`, { scroll: false });
    },
    [router, locale]
  );

  return (
    <div>
      {eventsLoading ? (
        <BreadcrumbSkeleton />
      ) : (
        <Breadcrumb
          items={[
            {
              name: t("pages.regions.title") || "محافظات",
            },
          ]}
        />
      )}

      <section className="categories">
        <div className="container">
          {regionsLoading && regions.length === 0 ? (
            <CategoriesSkeleton />
          ) : (
            <div
              className="regions-slider"
              aria-busy={regionsLoading}
            >
              <SwiperSlider
                key={`regions-${regions.length}`}
                uniqueId="governorate-regions"
                data={regions}
                renderItem={(region) => {
                  const isActive = Number(region.id) === Number(regionId);
                  return (
                    <div
                      role="button"
                      onClick={() => handleSelectRegion(region.id)}
                      className={isActive ? "ring-2 ring-primary region active" : ""}
                      data-active={isActive ? "true" : "false"}
                    >
                      <RegionCard region={region} isActive={isActive} />
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
                className="regions-swiper"
              />
            </div>
          )}
        </div>
      </section>

      
      <section className="pt-4">
        <div className="container" aria-busy={eventsUpdating}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h5 mb-0">{t("page_titles.events")}</h3>
          </div>

          {eventsLoading && events.length === 0 ? (
            <CompaniesListSkeleton />
          ) : events.length === 0 ? (
            <EmptyState
              title={t("pages.events.no_events_title")}
              description={t("pages.events.no_events_description")}
              illustration={<InboxIllustration />}
              actions={[
                { label: t("common.refresh"), variant: "outline", onClick: () => location.reload() },
                { label: t("navbar.home"), href: `/${locale}/`, variant: "primary" },
              ]}
              size="lg"
            />
          ) : (
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
                  <Pagination meta={eventsMeta} onPageChange={handleEventsPageChange} />
                </div>
              </div>
            </>
          )}
          
        </div>
      </section>
    </div>
  );
}
