'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents } from '@/store/slices/eventsSlice';
import EventCard from '@/components/EventCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';
import Loading from '@/components/GlobalLoader';
import Pagination from '@/components/Pagination';
import EventSideCard from '@/components/EventSideCard';

export default function EventsClientPage() {
    const dispatch = useDispatch();
    const { events, loading, error, pagination } = useSelector((state) => state.events);
    const t = useTranslations();

    useEffect(() => {
        dispatch(fetchEvents());
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchEvents(page));
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">Error: {error}</div>;
    }

    return (
        <div>
            <Breadcrumb items={[{ name: t('breadcrumb.events') }]} />
            {/* <Filter regions={regions} onFilterChange={handleFilterChange} /> */}
            <div className="container my-5">
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-1 section-title">{t('pages.events.all_events')}</h2>
                    </div>
                </div>
                <div className="row g-4">
                    {events.map((event) => (
                        <div key={event.id} className="unit col-12 col-md-4 col-xl-4">
                            <EventSideCard event={event} />
                        </div>
                    ))}
                </div>
                <div className='row'>
                    <div className='col-12'>
                        <Pagination meta={pagination} onPageChange={handlePageChange} />
                    </div>
                </div>
            </div>
        </div>
    );
}
