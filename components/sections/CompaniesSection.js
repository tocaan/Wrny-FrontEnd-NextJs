'use client';

import { usePathname } from 'next/navigation';
import Slider from '../ui/Slider';
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
                <div className="tiny-slider arrow-round arrow-blur arrow-hover">
                    <Slider
                        key={`${pathname}-${companiesData.records.length}`}
                        data={companiesData.records}
                        renderItem={(company) => (
                            <div className="h-100">
                                <CompanyCard company={company} />
                            </div>
                        )}
                        options={{

                            autoplay: true,
                            loop: false,
                            mouseDrag: true,
                            gutter: 16,
                            nav: false,
                            controls: true,
                            items: 1,
                            responsive: {
                                576: { items: 2 },
                                768: { items: 2 },
                                992: { items: 3 },
                                1200: { items: 4 },
                            },
                        }}
                    />
                </div>
            </div>
        </section>
    );
}
