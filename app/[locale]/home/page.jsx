'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { fetchHomeData } from '@/store/slices/homeSlice';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import RegionCard from '@/components/RegionCard';
import { useTranslations, useLocale } from 'next-intl';
import {
    HeroSkeleton, CategoriesSkeleton, RegionsSkeleton, CompaniesListSkeleton
} from '@/components/ui/Skeletons';
import EventsSection from '@/components/sections/EventsSection';
import CompaniesSection from '@/components/sections/CompaniesSection';

export default function HomePage() {
    const dispatch = useDispatch();
    const { data: homeData = [], loading, error } = useSelector((s) => s.home);
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

    const getSectionData = (type) => (Array.isArray(homeData) ? homeData.find(s => s?.type === type) ?? {} : {});

    const adsData = getSectionData('ads');
    const categoriesData = getSectionData('categories');
    const regionsData = getSectionData('regions');
    const companiesData = getSectionData('companies');
    const eventsRegionsData = getSectionData('events_regions');
    const eventsData = getSectionData('events');

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

    if (error) {
        return <div className="text-center py-5 text-danger">Error: {error}</div>;
    }

    return (
        <div>
            {adsData?.records?.length > 0 && (
                <section className="py-0 mb-0 home">
                    <HeroSection
                        slides={adsData.records.map(ad => ({ id: ad.id, image: ad.image, link: ad.link }))}
                    />
                </section>
            )}

            {categoriesData?.records?.length > 0 && (
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

            {regionsData?.records?.length > 0 && (
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

            {companiesData?.records?.length > 0 && <CompaniesSection companiesData={companiesData} />}
            {eventsRegionsData?.records?.length > 0 && <EventsSection eventsData={eventsRegionsData} />}
            {eventsData?.records?.length > 0 && <EventsSection eventsData={eventsData} />}
        </div>
    );
}
