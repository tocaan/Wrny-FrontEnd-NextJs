'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEvents } from '@/store/slices/eventsSlice';
import EventCard from '@/components/EventCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';

export default function EventsPage() {
    const dispatch = useDispatch();
    const { events, loading, error } = useSelector((state) => state.events);
    const t = useTranslations();

    useEffect(() => {
        dispatch(fetchEvents());
    }, []);

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">Error: {error}</div>;
    }

    return (
        <div>
            <Breadcrumb items={[{ name: t('events.all') }]} />
            {/* <Filter regions={regions} onFilterChange={handleFilterChange} /> */}
            <div className="container my-5">
                <h2 className="mb-4">{t('events.all')}</h2>
                <div className="row g-4">
                    {events.map((event) => (
                        <div key={event.id} className="col-md-6 col-lg-3">
                            <EventCard event={event} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
