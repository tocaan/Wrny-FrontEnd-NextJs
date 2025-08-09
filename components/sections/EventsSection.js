'use client';

import { usePathname } from 'next/navigation';
import EventCard from '@/components/EventCard';
import Slider from '../ui/Slider';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function EventsSection({ eventsData }) {
    const pathname = usePathname();
    const t = useTranslations();
    if (!eventsData?.records?.length) return null;

    return (
        <section className="landmarks home">
            <div className="container">
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-1 section-title">{eventsData.title}</h2>
                        <Link href="/events" className="btn btn-link p-0 fw-600 text-uppercase">{t('common.view_all')}</Link>
                    </div>
                </div>

                <div className="tiny-slider arrow-round arrow-blur arrow-hover">
                    <Slider
                        key={`${pathname}-${eventsData.records.length}`}
                        data={eventsData.records}
                        renderItem={(event) => (
                            <div className="h-100">
                                <EventCard event={event} eventType={eventsData.type} />
                            </div>
                        )}
                        options={{
                            dir: 'rtl',
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
