'use client';

import { usePathname } from 'next/navigation';
import SwiperSlider from '../ui/SwiperSlider';
import CompanyCard from '../CompanyCard';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function CompaniesCategorySection({ companiesData, title }) {
    const pathname = usePathname();
    const t = useTranslations();

    if (!companiesData?.length) return null;

    return (
        <section className="companies home">
            <div className="container">
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-1 section-title category-title" data-type="companies">{title}</h2>
                    </div>
                </div>
                <div className="companies-category-slider">
                    <SwiperSlider
                        key={`${pathname}-${companiesData.length}`}
                        uniqueId={`companies-category-${title?.replace(/\s+/g, '-').toLowerCase()}`}
                        data={companiesData}
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
                        className="companies-category-swiper"
                    />
                </div>
            </div>
        </section>
    );
}
