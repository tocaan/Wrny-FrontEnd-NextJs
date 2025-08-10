'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompanies, fetchRegions, setFilters } from '@/store/slices/companiesSlice';
import CompanyCard from '@/components/CompanyCard';
import Filter from '@/components/Filter';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';
import Loading from '@/components/GlobalLoader';
import { BreadcrumbSkeleton, CompaniesListSkeleton, FilterSkeleton } from '@/components/ui/Skeletons';
import Pagination from '@/components/Pagination';
import PageHead from '@/components/Head';

export default function CompaniesClientPage() {
    const dispatch = useDispatch();
    const { companies, loading, error, pagination } = useSelector((state) => state.companies);
    const t = useTranslations();

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    const handlePageChange = (page) => {
        dispatch(fetchCompanies(page));
    };

    if (loading) {
        return (
            <div>
                <BreadcrumbSkeleton />
                <CompaniesListSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="text-center py-5 text-danger">Error: {error}</div>
            </div>
        );
    }

    return (
        <div>
            <Breadcrumb items={[{ name: t('pages.companies.all_companies') }]} />
            <div className="container my-5">
                <div className="row mb-3">
                    <div className="col-12 d-flex justify-content-between align-items-center">
                        <h2 className="h4 mb-1 section-title">{t('pages.companies.all_companies')}</h2>
                    </div>
                </div>
                <div className="row g-4">
                    {companies.map((company) => (
                        <div key={company.id} className="col-md-6 col-lg-3">
                            <CompanyCard company={company} />
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
