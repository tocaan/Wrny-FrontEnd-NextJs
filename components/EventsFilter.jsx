// components/EventsFilter.jsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocale, useTranslations } from "next-intl";
import { fetchCountries, fetchRegionsByCountry, selectCountries, selectRegionsForCountry, selectRegionsStatus } from "@/store/slices/regionsSlice";
import { fetchCategories, selectCategoriesForLocale } from "@/store/slices/categoriesSlice";

export default function EventsFilter({ defaultCountryId = 117, initial = {}, onApply }) {
    const t = useTranslations();
    const locale = useLocale();
    const dispatch = useDispatch();

    const currentLang = useMemo(() => (locale || 'en').startsWith('ar') ? 'ar' : 'en', [locale]);

    const countries = useSelector(selectCountries);
    const regions = useSelector(selectRegionsForCountry(defaultCountryId));
    const regionsStatus = useSelector(selectRegionsStatus(defaultCountryId));
    const categories = useSelector(selectCategoriesForLocale(currentLang));

    const [selectedRegionIds, setSelectedRegionIds] = useState(initial.regionIds || []);
    const [selectedCategoryId, setSelectedCategoryId] = useState(initial.categoryId || null);

    
    useEffect(() => {
        setSelectedRegionIds(Array.isArray(initial.regionIds) ? initial.regionIds : []);
        setSelectedCategoryId(initial.categoryId || null);
    }, [initial.regionIds, initial.categoryId]);

    useEffect(() => {
        dispatch(fetchCountries());
        dispatch(fetchRegionsByCountry(defaultCountryId));
        dispatch(fetchCategories(currentLang));
    }, [dispatch, defaultCountryId, currentLang]);

    const toggleRegion = (id) => {
        setSelectedRegionIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const apply = () => {
        const filters = {};
        if (selectedRegionIds.length) filters['region_ids[]'] = selectedRegionIds;
        if (selectedCategoryId) filters['category_id'] = selectedCategoryId;
        onApply?.(filters);
    };

    const reset = () => {
        setSelectedRegionIds([]);
        setSelectedCategoryId(null);
        onApply?.({});
    };

    return (
        <div className="mt-3">
            <div className="container">
                <div className="row"><div className="col-12">
                    <div className="d-flex">
                        <input type="checkbox" className="btn-check" id="btn-check-soft" />
                        <label className="btn btn-100 btn-primary-soft btn-primary-check mb-0 me-auto"
                            htmlFor="btn-check-soft" data-bs-toggle="collapse" data-bs-target="#collapseFilter" aria-controls="collapseFilter">
                            <i className="bi fa-fe bi-sliders mx-2"></i>{t('pages.events.show_filter') || 'عرض الفلتر'}
                        </label>
                    </div>
                </div></div>

                <div className="collapse" id="collapseFilter">
                    <div className="card card-body bg-light p-4 mt-4 z-index-9">
                        <form className="row g-4" onSubmit={(e) => { e.preventDefault(); apply(); }}>
                            {/* المحافظات */}
                            <div className="col-12">
                                <div className="form-control-borderless">
                                    <label className="form-label text-primary fw-600">{t('pages.events.filter_regions') || 'المحافظة'}</label>
                                    <div className="row g-3">
                                        {regionsStatus === 'pending' && <div className="px-3 small">…{t('common.loading') || 'جارٍ التحميل'}</div>}
                                        {regions.map((r) => (
                                            <div key={r.id} className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" id={`region-${r.id}`}
                                                        checked={selectedRegionIds.includes(r.id)} onChange={() => toggleRegion(r.id)} />
                                                    <label className="form-check-label h6 fw-light mb-0" htmlFor={`region-${r.id}`}>{r.name}</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <hr />

                            {/* الفئات */}
                            <div className="col-12">
                                <div className="form-control-borderless">
                                    <label className="form-label text-primary fw-600">{t('pages.events.filter_categories') || 'الفئات'}</label>
                                    <div className="row g-3">
                                        <div className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="radio" name="category" id="cat-all"
                                                    checked={!selectedCategoryId} onChange={() => setSelectedCategoryId(null)} />
                                                <label className="form-check-label h6 fw-light mb-0" htmlFor="cat-all">
                                                    {t('pages.categories.all_categories') || 'كل الفئات'}
                                                </label>
                                            </div>
                                        </div>

                                        {categories.map((c) => (
                                            <div key={c.id} className="col-sm-6 col-md-4 col-lg-3 col-xl-2">
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="category" id={`cat-${c.id}`}
                                                        checked={selectedCategoryId === c.id} onChange={() => setSelectedCategoryId(c.id)} />
                                                    <label className="form-check-label h6 fw-light mb-0" htmlFor={`cat-${c.id}`}>{c.name}</label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="text-center align-items-center mt-5">
                                <button type="submit" className="btn btn-dark mb-0 mx-2 w-25">{t('common.apply') || 'تطبيق'}</button>
                                <button type="button" className="btn btn-outline-secondary mb-0 mx-2 w-25" onClick={reset}>
                                    {t('common.reset') || 'إعادة ضبط'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
