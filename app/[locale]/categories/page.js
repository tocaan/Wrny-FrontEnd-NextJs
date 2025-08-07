'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import Navbar from '@/components/layouts/Navbar';
import CategoryCard from '@/components/CategoryCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';

export default function CategoriesPage() {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);
    const t = useTranslations();

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">Error: {error}</div>;
    }

    return (
        <div>
            <Breadcrumb items={[{ name: t('categories.all') }]} />
            {/* <Filter regions={regions} onFilterChange={handleFilterChange} /> */}
            <div className="container my-5">
                <h2 className="mb-4">{t('categories.all')}</h2>
                <div className="row g-4">
                    {categories.map((category) => (
                        <div key={category.id} className="col-md-6 col-lg-3">
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
