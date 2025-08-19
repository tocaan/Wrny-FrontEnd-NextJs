'use client';
import { useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchEvents,
    selectEventsList,
    selectEventsEntry,
    selectEventsStatus,
    selectEventsError,
} from '@/store/slices/eventsSlice';
import EventSideCard from '@/components/EventSideCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations, useLocale } from 'next-intl';
import Loading from '@/components/GlobalLoader';
import Pagination from '@/components/Pagination';
import EventsFilter from '@/components/EventsFilter';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import EmptyState from '@/components/ui/EmptyState';
import InboxIllustration from '@/components/ui/illustrations/InboxIllustration';

export default function EventsClientPage() {
    const dispatch = useDispatch();
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const currentLang = useMemo(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('LANG');
            if (saved) return saved;
        }
        return (locale || 'en').startsWith('ar') ? 'ar' : 'en';
    }, [locale]);

    const page = useMemo(() => {
        const p = Number(searchParams.get('page') || '1');
        return Number.isFinite(p) && p > 0 ? p : 1;
    }, [searchParams]);

    const regionIds = useMemo(() => {
        // region_ids[]=10&region_ids[]=13
        return searchParams.getAll('region_ids[]').map((n) => Number(n)).filter(Boolean);
    }, [searchParams]);

    const categoryId = useMemo(() => {
        const c = searchParams.get('category_id');
        return c ? Number(c) : null;
    }, [searchParams]);

    const filters = useMemo(() => {
        const f = {};
        if (regionIds.length) f['region_ids[]'] = regionIds;
        if (categoryId) f['category_id'] = categoryId;
        return f;
    }, [regionIds, categoryId]);

    const params = useMemo(() => ({ page, locale: currentLang, filters }), [page, currentLang, filters]);

    useEffect(() => {
        dispatch(fetchEvents(params));
    }, [dispatch, params]);

    const entry = useSelector(selectEventsEntry(params));
    const events = useSelector(selectEventsList(params));
    const status = useSelector(selectEventsStatus(params));
    const error = useSelector(selectEventsError(params));

    const hasCache = !!entry;
    const loading = status === 'pending' && !hasCache;
    const meta = entry?.pagination || { current_page: page, last_page: 1, total: events.length, per_page: events.length || 12 };

    useEffect(() => {
        if (meta?.current_page && meta?.last_page && meta.current_page < meta.last_page) {
            dispatch(fetchEvents({ page: meta.current_page + 1, locale: currentLang, filters }));
        }
    }, [dispatch, currentLang, filters, meta?.current_page, meta?.last_page]);

    const replaceUrl = useCallback((next) => {
        const sp = new URLSearchParams(searchParams.toString());

        if (next.page && next.page > 1) sp.set('page', String(next.page));
        else sp.delete('page');

        // category_id
        sp.delete('category_id');
        if (next.categoryId) sp.set('category_id', String(next.categoryId));

        // region_ids[]
        sp.delete('region_ids[]');
        if (Array.isArray(next.regionIds)) {
            next.regionIds.forEach((id) => sp.append('region_ids[]', String(id)));
        }

        router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }, [router, pathname, searchParams]);

    const handlePageChange = (p) => {
        replaceUrl({ page: p, categoryId, regionIds });
        try { window?.scrollTo?.({ top: 0, behavior: 'smooth' }); } catch { }
    };

    const handleApplyFilters = useCallback((newFilters) => {
        // newFilters: { 'region_ids[]': number[], category_id?: number }
        const nextRegionIds = Array.isArray(newFilters?.['region_ids[]']) ? newFilters['region_ids[]'] : [];
        const nextCategoryId = newFilters?.category_id ? Number(newFilters.category_id) : null;

        replaceUrl({ page: 1, categoryId: nextCategoryId, regionIds: nextRegionIds });
    }, [replaceUrl]);

    if (loading) return <Loading />;
    if (status === 'failed' && !hasCache) return <div className="text-center py-5 text-danger">{error}</div>;

    return (
        <div aria-busy={status === 'pending' && hasCache}>
            {/* <Breadcrumb items={[{ name: t('breadcrumb.events') }]} /> */}

            <EventsFilter
                defaultCountryId={117}
                initial={{ regionIds, categoryId }}
                onApply={handleApplyFilters} />

            <div className="container my-5">
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-1 section-title">{t('pages.events.all_events')}</h2>
                    </div>
                </div>

                {events.length === 0 ? (
                    <EmptyState
                        title={t('pages.events.no_events_title')}
                        description={t('pages.events.no_events_description')}
                        illustration={<InboxIllustration />}
                        actions={[
                            { label: t('common.refresh'), variant: 'outline', onClick: () => location.reload() },
                            { label: t('navbar.home'), href: `/${locale}/`, variant: 'primary' },
                        ]}
                        size="lg"
                    />
                ) : (
                    <div className="row g-4">
                        {events.map((event) => (
                            <div key={event.id} className="unit col-12 col-md-4 col-xl-4">
                                <EventSideCard event={event} />
                            </div>
                        ))}
                    </div>
                )}
            
                {events.length > 0 && (
                    <div className="row">
                        <div className="col-12">
                            <Pagination meta={meta} onPageChange={handlePageChange} />
                        </div>
                    </div>
                )}
            
                {status === 'failed' && hasCache && (
                    <div className="text-center py-3 text-danger small">{error}</div>
                )}
            </div>
        </div>
    );
}
