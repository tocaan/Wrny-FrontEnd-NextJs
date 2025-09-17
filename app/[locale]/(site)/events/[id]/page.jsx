'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'next/navigation';
import { fetchEventDetails } from '@/store/slices/eventSlice';
import Image from 'next/image';
import SwiperSlider from '@/components/ui/SwiperSlider';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from '@/i18n/routing';
import GlobalLoader from '@/components/GlobalLoader';
import SafeImage from '@/components/SafeImage';
import { HeartIcon } from 'lucide-react';
import FavoriteHeart from '@/components/ui/FavoriteHeart';
import GoogleMap from '@/components/ui/GoogleMap';

export default function EventDetailsClient() {
    const pathname = usePathname();
    const { id } = useParams();
    const dispatch = useDispatch();
    const { event, loading, error } = useSelector((s) => s.event);
    const t = useTranslations();
    const locale = useLocale();
    const lightboxRef = useRef(null);
    const rafRef = useRef(null);

    // fetch
    useEffect(() => {
        if (id) dispatch(fetchEventDetails(id));
    }, [dispatch, id]);

    // title
    useEffect(() => {
        if (event?.name) {
            document.title = `${event.name} - ${t('app.title')}`;
        } else {
            document.title = t('page_titles.events');
        }
    }, [event?.name, t]);

    // format date
    const formatDate = (d) => {
        if (!d) return '—';
        try {
            const date = new Date(d.replace(' ', 'T'));
            const localeForDate = locale === 'ar' ? 'ar-EG' : 'en-US';
            return date.toLocaleDateString(localeForDate, { year: 'numeric', month: 'long', day: 'numeric' });
        } catch {
            return d;
        }
    };

    const coverImages = useMemo(
        () => (event?.images?.length ? event.images : ['/assets/images/placeholder.svg']),
        [event?.images]
    );


    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!coverImages?.length) return;


        const nodes = document.querySelectorAll('.glightbox4');
        if (!nodes || nodes.length === 0) return;


        if (lightboxRef.current) {
            try { lightboxRef.current.destroy(); } catch { }
            lightboxRef.current = null;
        }

        let cancelled = false;

        rafRef.current = window.requestAnimationFrame(async () => {
            try {
                const GLightbox = (await import('glightbox')).default;
                if (cancelled) return;

                lightboxRef.current = GLightbox({ selector: '.glightbox4' });
            } catch (e) {
                console.error('GLightbox init failed:', e);
            }
        });

        return () => {
            cancelled = true;
            if (rafRef.current) {
                window.cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            if (lightboxRef.current) {
                try { lightboxRef.current.destroy(); } catch { }
                lightboxRef.current = null;
            }
        };
    }, [coverImages, pathname]);

    const [isFavorited, setIsFavorited] = useState(false);

    useEffect(() => {
        setIsFavorited(!!event?.is_favorited);
    }, [event?.is_favorited]);


    if (loading && !event) return <GlobalLoader />;
    if (error) return <div className="text-center py-5 text-danger">{error}</div>;
    if (!event) return null;

    return (
        <>
            <section className="py-0">
                <div className="container-fluid px-0">
                    <div className="event-images-slider">
                        <SwiperSlider
                            uniqueId="event-images"
                            data={coverImages}
                            renderItem={(src, i) => (
                                <a
                                    key={i}
                                    href={src}
                                    className="glightbox4 w-100 h-100"
                                    data-gallery="event-gallery"
                                    data-glightbox={`title: ${event?.name || ''};`}
                                >
                                    <div className="card card-element-hover card-overlay-hover rounded-0 overflow-hidden event-img">
                                        <SafeImage src={src} alt={event?.name || 'event'} width={1200} height={700} />
                                        <div className="hover-element w-100 h-100">
                                            <i className="bi bi-fullscreen fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-1 p-2 lh-1"></i>
                                        </div>
                                    </div>
                                </a>
                            )}
                            options={{
                                spaceBetween: 10,
                                autoplay: {
                                    delay: 3000,
                                    disableOnInteraction: false,
                                },
                                loop: true,
                                breakpoints: {
                                    0: { slidesPerView: 1 },
                                    576: { slidesPerView: 2 },
                                    992: { slidesPerView: 3 }
                                }
                            }}
                            showNavigation={true}
                            showPagination={false}
                            className="event-images-swiper"
                        />
                    </div>
                </div>
            </section>

            {/* العنوان والمعلومات المختصرة */}
            <section>
                <div className="container">
                    <div className="row"><div className="col-12">
                        <div className="card bg-light p-0 pb-0">
                            <div className="card-body d-flex justify-content-between flex-wrap">
                                <div className="d-flex">
                                    <div>
                                        <h1 className="h4 mt-2 mb-2">{event.name}</h1>
                                        <p className="mb-2 mb-sm-0">
                                            <i className="bi bi-geo-alt mx-1 text-primary"></i>
                                            {event.address || '—'}
                                        </p>
                                        <p className="mb-2">
                                            <i className="bi bi-calendar2-plus text-primary mx-2"></i>
                                            {formatDate(event.start_date || event.end_date)}
                                        </p>
                                    </div>
                                </div>

                                <ul className="list-inline mb-0">
                                    <li className="list-inline-item heart-icon">
                                        <FavoriteHeart
                                            type="events"
                                            itemId={event.id}
                                            isFavorited={event.is_favorited}
                                            onChange={(val) => setIsFavorited(val)}
                                        />
                                        {/* <button className="btn btn-sm btn-white px-2" type="button">
                      <i className={`bi fa-fw ${event.is_favorited ? 'bi-heart-fill text-danger' : 'bi-heart'}`}></i>
                    </button> */}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div></div>
                </div>
            </section>

            {/* المحتوى */}
            <section className="pt-0">
                <div className="container">
                    <div className="row g-4 g-lg-5">
                        {/* تفاصيل + الخريطة */}
                        <div className="col-lg-7 col-xl-8">
                            <div className="card shadow mb-4">
                                <div className="card-header bg-transparent border-bottom">
                                    <h4 className="h5 mb-0">{t('pages.events.aboutEvent')}</h4>
                                </div>
                                <div className="card-body">
                                    <p className="mb-3">{event.description || '—'}</p>
                                </div>
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header border-bottom">
                                    <h5 className="mb-0">{t('common.location')}</h5>
                                </div>
                                <div className="card-body">
                                    <p className="mb-3">
                                        <i className="bi bi-geo-alt mx-1 text-primary"></i>{event.address || '—'}
                                    </p>
                                    {(event.lat && event.lng) && (
                                        <GoogleMap
                                            lat={event.lat}
                                            lng={event.lng}
                                            height={300}
                                            zoom={15}
                                            markerColor="red"
                                            title="Event Location"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-lg-5 col-xl-4">
                            <div className="card shadow mb-4">
                                <div className="card-header border-bottom">
                                    <h5 className="mb-0">{t('pages.events.ticketCategories')}</h5>
                                </div>
                                <div className="card-body">
                                    {event.tickets?.length ? (
                                        <ul className="list-group list-group-borderless mb-0">
                                            {event.tickets.map((tic, i) => (
                                                <div key={tic.id ?? i}>
                                                    <li className="list-group-item d-flex justify-content-between">
                                                        <span>{tic.category}: {Number(tic.price).toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')} {t('common.currency.kd')}</span>
                                                    </li>
                                                    {i < event.tickets.length - 1 && (
                                                        <li className="list-group-item py-0"><hr className="my-1" /></li>
                                                    )}
                                                </div>
                                            ))}
                                        </ul>
                                    ) : <div className="text-muted">{t('pages.events.no_tickets')}</div>}
                                </div>
                            </div>

                            <div className="card shadow mb-4">
                                <div className="card-header border-bottom">
                                    <h5 className="mb-0">{t('common.contactInfo')}</h5>
                                </div>
                                <div className="card-body">
                                    <ul className="list-group list-group-borderless my-3">
                                        <li className="list-group-item">
                                            <span className="h6 fs-14 fw-normal mb-0">
                                                <i className="bi fa-fw bi-geo-alt mx-2 text-primary"></i>
                                                {event.address || '—'}
                                            </span>
                                        </li>
                                        {event.company?.contact_phone && (
                                            <li className="list-group-item">
                                                <a className="h6 fs-14 fw-normal mb-0" href={`tel:${event.company.contact_phone}`}>
                                                    <i className="bi fa-fw bi-telephone-forward mx-2 text-primary"></i>
                                                    <span dir="ltr">{event.company.contact_phone}</span>
                                                </a>
                                            </li>
                                        )}
                                        {event.company?.contact_email && (
                                            <li className="list-group-item">
                                                <a className="h6 fs-14 fw-normal mb-0" href={`mailto:${event.company.contact_email}`}>
                                                    <i className="bi fa-fw bi-envelope mx-2 text-primary"></i>
                                                    {event.company.contact_email}
                                                </a>
                                            </li>
                                        )}
                                        {event.company?.license_number && (
                                            <li className="list-group-item">
                                                <span className="h6 fs-14 fw-normal mb-0">
                                                    <i className="bi fa-fw bi-person-badge mx-2 text-primary"></i>
                                                    {event.company.license_number}
                                                </span>
                                            </li>
                                        )}
                                        {event.company?.website_url && (
                                            <li className="list-group-item">
                                                <a className="h6 fs-14 fw-normal mb-0" href={event.company.website_url} target="_blank" rel="noreferrer">
                                                    <i className="bi fa-fw bi-globe mx-2 text-primary"></i>
                                                    {event.company.website_url}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
