'use client';
import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCompanies,
    selectCompaniesList,
    selectCompaniesEntry,
    selectCompaniesStatus,
    selectCompaniesError,
} from '@/store/slices/companiesSlice';
import CompanyCard from '@/components/CompanyCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations, useLocale } from 'next-intl';
import { BreadcrumbSkeleton, CompaniesListSkeleton } from '@/components/ui/Skeletons';
import Pagination from '@/components/Pagination';

export default function CompaniesClientPage() {
    const dispatch = useDispatch();
    const t = useTranslations();
    const locale = useLocale();

    const [page, setPage] = useState(1);
    const currentLang = useMemo(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('LANG');
            if (saved) return saved;
        }
        return (locale || 'en').startsWith('ar') ? 'ar' : 'en';
    }, [locale]);

    const params = useMemo(() => ({ page, locale: currentLang, filters: {} }), [page, currentLang]);

    useEffect(() => {
        dispatch(fetchCompanies(params));
    }, [dispatch, params]);

    const entry = useSelector(selectCompaniesEntry(params));
    const list = useSelector(selectCompaniesList(params));
    const status = useSelector(selectCompaniesStatus(params));
    const error = useSelector(selectCompaniesError(params));

    const hasCache = !!entry;
    const loading = status === 'pending' && !hasCache;

    const handlePageChange = (p) => {
        setPage(p);
        try { window?.scrollTo?.({ top: 0, behavior: 'smooth' }); } catch { }
    };

    if (loading) {
        return (
            <div>
                <BreadcrumbSkeleton />
                <CompaniesListSkeleton />
            </div>
        );
    }

    if (status === 'failed' && !hasCache) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    const meta = entry?.pagination || { current_page: page, last_page: 1, total: list.length, per_page: list.length || 12 };

    return (
        <div aria-busy={status === 'pending' && hasCache}>
            <Breadcrumb items={[{ name: t('pages.companies.all_companies') }]} />

            <div className="container my-5">
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-1 section-title">{t('pages.companies.all_companies')}</h2>
                    </div>
                </div>

                <div className="row g-4">
                    {list.map((company) => (
                        <div key={company.id} className="col-md-6 col-lg-3">
                            <CompanyCard company={company} />
                        </div>
                    ))}
                </div>

                <div className="row">
                    <div className="col-12">
                        <Pagination meta={meta} onPageChange={handlePageChange} />
                    </div>
                </div>

                {status === 'failed' && hasCache && (
                    <div className="text-center py-3 text-danger small">{error}</div>
                )}
            </div>
        </div>
    );
}
