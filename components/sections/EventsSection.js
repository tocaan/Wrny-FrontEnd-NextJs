'use client';

import { usePathname } from 'next/navigation';
import EventCard from '@/components/EventCard';
import SwiperSlider from '../ui/SwiperSlider';
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

                <div className="events-slider">
                    <SwiperSlider
                        key={`${pathname}-${eventsData.records.length}`}
                        uniqueId="events-section"
                        data={eventsData.records}
                        renderItem={(event) => (
                            <EventCard event={event} eventType={eventsData.type} />
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
                        className="events-swiper"
                    />
                </div>
            </div>
        </section>
    );
}
