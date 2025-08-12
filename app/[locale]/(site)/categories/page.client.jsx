'use client';

import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    fetchCategories,
    selectCategoriesStatus,
    selectCategoriesError,
    selectCategoriesForLocale,
    selectCategoriesEntry,
} from '@/store/slices/categoriesSlice';
import CategoryCard from '@/components/CategoryCard';
import Breadcrumb from '@/components/Breadcrumb';
import { useTranslations, useLocale } from 'next-intl';
import { CategoriesSkeleton } from '@/components/ui/Skeletons';

export default function CategoriesPageClient() {
    const dispatch = useDispatch();
    const t = useTranslations();
    const locale = useLocale();

    const currentLang = useMemo(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('LANG');
            if (saved) return saved;
        }
        return (locale || 'en').startsWith('ar') ? 'ar' : 'en';
    }, [locale]);

    // اطلب البيانات؛ الـ condition جوه الثنك بيمنع التكرار ويستخدم الكاش
    useEffect(() => {
        dispatch(fetchCategories(currentLang));
    }, [dispatch, currentLang]);

    const status = useSelector(selectCategoriesStatus);
    const error = useSelector(selectCategoriesError);
    const cats = useSelector(selectCategoriesForLocale(currentLang));
    const entry = useSelector(selectCategoriesEntry(currentLang));

    const hasCache = (entry?.ids?.length || 0) > 0;
    const loading = status === 'pending' && !hasCache;

    if (loading) return <CategoriesSkeleton />;

    if (status === 'failed' && !hasCache) {
        return <div className="text-center py-5 text-danger">{error}</div>;
    }

    return (
        <div aria-busy={status === 'pending' && hasCache}>
            <Breadcrumb items={[{ name: t('breadcrumb.categories') }]} />

            <div className="container my-5">
                <div className="row g-4">
                    {cats.map((category) => (
                        <div key={category.id} className="col-4 col-md-4 col-xl-2">
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
