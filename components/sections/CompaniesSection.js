'use client';

import { usePathname } from 'next/navigation';
import SwiperSlider from '../ui/SwiperSlider';
import CompanyCard from '../CompanyCard';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CompaniesSection({ companiesData }) {
    const pathname = usePathname();
    const t = useTranslations();

    if (!companiesData?.records?.length) return null;

    return (
        <section className="companies home">
            <div className="container">
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-1 section-title">{companiesData.title}</h2>
                        <Link href="/companies" className="btn btn-link p-0 fw-600 text-uppercase">{t('common.view_all')}</Link>
                    </div>
                </div>
                <div className="companies-slider">
                    <SwiperSlider
                        key={`${pathname}-${companiesData.records.length}`}
                        uniqueId="companies-section"
                        data={companiesData.records}
                        renderItem={(company) => (
                            <CompanyCard company={company} />
                        )}
                        options={{
                            spaceBetween: 16,
                            autoplay: {
                                delay: 3000,
                                disableOnInteraction: false,
                            },
                            loop: false,
                            breakpoints: {
                                576: { slidesPerView: 2 },
                                768: { slidesPerView: 2 },
                                992: { slidesPerView: 3 },
                                1200: { slidesPerView: 4 },
                            },
                        }}
                        showNavigation={true}
                        showPagination={false}
                        className="companies-swiper"
                    />
                </div>
            </div>
        </section>
    );
}
