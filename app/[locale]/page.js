'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchHomeData } from '@/store/slices/homeSlice';
import HeroSection from '@/components/HeroSection';
import CategoryCard from '@/components/CategoryCard';
import RegionCard from '@/components/RegionCard';
import CompanyCard from '@/components/CompanyCard';
import EventCard from '@/components/EventCard';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
    const dispatch = useDispatch();
    const { data: homeData, loading, error } = useSelector((state) => state.home);
    const t = useTranslations();

    useEffect(() => {
        dispatch(fetchHomeData());
    }, [dispatch]);

    const getSectionData = (type) => {
        return homeData.find(section => section.type === type) || [];
    };

    const adsData = getSectionData('ads');
    const categoriesData = getSectionData('categories');
    const regionsData = getSectionData('regions');
    const companiesData = getSectionData('companies');
    const eventsRegionsData = getSectionData('events_regions');
    const eventsData = getSectionData('events');

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">Error: {error}</div>;
    }

    return (
        <div>
            {
                adsData.records?.length > 0 && (
                    <HeroSection slides={adsData.records?.map((ad) => ({
                        id: ad.id,
                        image: ad.image,
                        link: ad.link,
                    }))} />
                )
            }
            {/* قسم الأقسام */}
            {
                categoriesData.records?.length > 0 && (
                    <div className="container my-5">
                        <div className="row g-3">
                            {categoriesData.records.slice(0, 5).map((category) => (
                                <div key={category.id} className="col-4 col-md-4 col-xl-2">
                                    <CategoryCard category={category} />
                                </div>
                            ))}
                            <div className="col-4 col-md-4 col-xl-2">
                                <CategoryCard category={{ name: t('categories.all'), id: "all" }} />
                            </div>
                        </div>
                    </div>
                )
            }
            {/* قسم المحافظات */}
            {
                regionsData.records?.length > 0 && (
                    <div className="container my-5">
                        <div className="row mb-3">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-1 section-title">{regionsData.title}</h2>
                                <Link href="/regions" className="btn btn-link p-0 fw-600 text-uppercase">{t('view_all')}</Link>
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
                )
            }
            {/* قسم الشركات */}
            {
                companiesData.records?.length > 0 && (
                    <div className="container my-5">
                        <div className="row mb-3">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-1 section-title">{companiesData.title}</h2>
                                <Link href="/companies" className="btn btn-link p-0 fw-600 text-uppercase">{t('view_all')}</Link>
                            </div>
                        </div>
                        <div className="row g-4">
                            {companiesData.records.map((company) => (
                                <div key={company.id} className="col-md-6 col-lg-3">
                                    <CompanyCard company={company} />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
            {/* قسم فعاليات المحافظات */}
            {
                eventsRegionsData.records?.length > 0 && (
                    <div className="container my-5">
                        <div className="row mb-3">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-1 section-title">{eventsRegionsData.title}</h2>
                                <Link href="/events" className="btn btn-link p-0 fw-600 text-uppercase">{t('view_all')}</Link>
                            </div>
                        </div>
                        <div className="row g-4">
                            {eventsRegionsData.records.slice(0, 4).map((event) => (
                                <div key={event.id} className="col-md-6 col-lg-3">
                                    <EventCard event={event} />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
            {/* قسم الفعاليات */}
            {
                eventsData.records?.length > 0 && (
                    <div className="container my-5">
                        <div className="row mb-3">
                            <div className="col-12 d-flex justify-content-between align-items-center">
                                <h2 className="h4 mb-1 section-title">{eventsData.title}</h2>
                                <Link href="/events" className="btn btn-link p-0 fw-600 text-uppercase">{t('view_all')}</Link>
                            </div>
                        </div>
                        <div className="row g-4">
                            {eventsData.records.map((event) => (
                                <div key={event.id} className="col-md-6 col-lg-3">
                                    <EventCard event={event} eventType={eventsData.type} />
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    );
}
