'use client';

import { usePathname } from 'next/navigation';
import Slider from '../ui/Slider';
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
                <div className="tiny-slider arrow-round arrow-blur arrow-hover">
                    <Slider
                        key={`${pathname}-${companiesData.length}`}
                        data={companiesData}
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
