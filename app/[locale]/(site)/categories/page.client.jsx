'use client';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '@/store/slices/categoriesSlice';
import Navbar from '@/components/layouts/Navbar';
import CategoryCard from '@/components/CategoryCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations } from 'next-intl';
import Loading from '@/components/GlobalLoader';
import { CategoriesSkeleton } from '@/components/ui/Skeletons';

export default function CategoriesPageClient() {
    const dispatch = useDispatch();
    const { categories, loading, error } = useSelector((state) => state.categories);
    const t = useTranslations();

    useEffect(() => {
        dispatch(fetchCategories());
    }, []);

    if (loading) {
        return <CategoriesSkeleton />;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">Error: {error}</div>;
    }

    return (
        <div>
            <Breadcrumb items={[{ name: t('breadcrumb.categories') }]} />
            {/* <Filter regions={regions} onFilterChange={handleFilterChange} /> */}
            <div className="container my-5">
                <div className="row g-4">
                    {categories.map((category) => (
                        <div key={category.id} className="col-4 col-md-4 col-xl-2">
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
