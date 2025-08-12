'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import {
    fetchHomeData,
    selectHomeStatus,
    selectHomeError,
    selectHomeForLocale,
    selectHomeSection,
} from '@/store/slices/homeSlice';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import RegionCard from '@/components/RegionCard';
import { useTranslations, useLocale } from 'next-intl';
import {
    HeroSkeleton, CategoriesSkeleton, RegionsSkeleton, CompaniesListSkeleton
} from '@/components/ui/Skeletons';
import EventsSection from '@/components/sections/EventsSection';
import CompaniesSection from '@/components/sections/CompaniesSection';
import EventsRegionSection from '@/components/sections/EventsRegionSection';

export default function HomePage() {
    const dispatch = useDispatch();
    const t = useTranslations();
    const locale = useLocale();

    const currentLang = useMemo(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('LANG');
            if (saved) return saved;
        }
        return (locale || 'en').startsWith('ar') ? 'ar' : 'en';
    }, [locale]);

    useEffect(() => {
        dispatch(fetchHomeData(currentLang));
    }, [dispatch, currentLang]);

    const status = useSelector(selectHomeStatus);
    const error = useSelector(selectHomeError);
    const entry = useSelector(selectHomeForLocale(currentLang));

    const adsData = useSelector(selectHomeSection(currentLang, 'ads'));
    const categoriesData = useSelector(selectHomeSection(currentLang, 'categories'));
    const regionsData = useSelector(selectHomeSection(currentLang, 'regions'));
    const companiesData = useSelector(selectHomeSection(currentLang, 'companies'));
    const eventsRegionsData = useSelector(selectHomeSection(currentLang, 'events_regions'));
    const eventsData = useSelector(selectHomeSection(currentLang, 'events'));

    const hasCache = (entry?.data?.length || 0) > 0;
    const loading = status === 'pending' && !hasCache;

    const heroSlides = useMemo(
        () => (adsData?.records || []).map(ad => ({ id: ad.id, image: ad.image, link: ad.link })),
        [adsData?.records]
    );

    if (loading) {
        return (
            <>
                <HeroSkeleton />
                <CategoriesSkeleton />
                <RegionsSkeleton />
                <CompaniesListSkeleton />
            </>
        );
    }

    if (status === 'failed') {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <div>
            {heroSlides.length > 0 && (
                <section className="py-0 mb-0 home">
                    <HeroSection slides={heroSlides} />
                </section>
            )}

            {Array.isArray(categoriesData?.records) && categoriesData.records.length > 0 && (
                <section className="categories home pt-3 pt-md-5 pb-0 mb-3">
                    <div className="container px-lg-5">
                        <div className="row g-3">
                            {categoriesData.records.slice(0, 5).map((category) => (
                                <div key={category.id} className="col-4 col-md-4 col-xl-2">
                                    <CategoryCard category={category} />
                                </div>
                            ))}
                            <div className="col-4 col-md-4 col-xl-2">
                                <CategoryCard category={{ name: t('pages.categories.all_categories'), id: 'all' }} />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {Array.isArray(regionsData?.records) && regionsData.records.length > 0 && (
                <section className="governorates home">
                    <div className="container">
                        <div className="row mb-3">
                            <div className="col-12 text-center">
                                <h2 className="h4 mb-1 section-title">{regionsData.title}</h2>
                            </div>
                        </div>
                        <div className="row g-4">
                            {regionsData.records.map((region) => (
                                <div key={region.id} className="col-4 col-md-4 col-xl-2">
                                    <RegionCard region={region} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {Array.isArray(companiesData?.records) && companiesData.records.length > 0 && (
                <CompaniesSection companiesData={companiesData} />
            )}

            {Array.isArray(eventsRegionsData?.records) && eventsRegionsData.records.length > 0 && (
                <EventsRegionSection eventsData={eventsRegionsData} type="reg" />
            )}

            {Array.isArray(eventsData?.records) && eventsData.records.length > 0 && (
                <EventsSection eventsData={eventsData} />
            )}
        </div>
    );
}
