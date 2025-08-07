'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCompanies, fetchRegions, setFilters } from '@/store/slices/companiesSlice';
import CompanyCard from '@/components/CompanyCard';
import Filter from '@/components/Filter';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';

export default function CompaniesPage() {
    const dispatch = useDispatch();
    const { companies, filters, loading, error } = useSelector((state) => state.companies);
    const t = useTranslations();

    useEffect(() => {
        dispatch(fetchCompanies(filters));
    }, [dispatch, filters]);

    const handleFilterChange = (newFilters) => {
        dispatch(setFilters(newFilters));
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">Error: {error}</div>;
    }

    return (
        <div>
            <Breadcrumb items={[{ name: t('companies.all') }]} />
            {/* <Filter regions={regions} onFilterChange={handleFilterChange} /> */}
            <div className="container my-5">
                <h2 className="mb-4">{t('companies.all')}</h2>
                <div className="row g-4">
                    {companies.map((company) => (
                        <div key={company.id} className="col-md-6 col-lg-3">
                            <CompanyCard company={company} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
