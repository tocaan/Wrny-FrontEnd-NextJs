'use client';

import Image from 'next/image';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, selectSettingsByLocale } from '@/store/slices/settingsSlice';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { sanitizeHTML } from '@/utils/sanitize';

export default function AboutClientPage() {
    const t = useTranslations();
    const { locale } = useParams();
    const dispatch = useDispatch();
    const settings = useSelector((s) => selectSettingsByLocale(s, locale || 'ar'));

    useEffect(() => {
        if (!settings && locale) dispatch(fetchSettings(locale));
    }, [dispatch, locale, settings]);

    const lead = t('pages.about.lead');
    const rawHtml = (locale === 'ar' ? settings?.about_ar : settings?.about_en) || '';
    
    // Sanitize HTML to prevent XSS attacks
    const aboutHtml = useMemo(() => sanitizeHTML(rawHtml), [rawHtml]);

    return (
        <section>
            <div className="container">
                {/* <div className="row mb-4">
                    <div className="col-xl-10 mx-auto text-center">
                        <h1 className="h3">{lead}</h1>
                        <p className="lead">{t('pages.about.leadSub')}</p>
                    </div>
                </div> */}

                <div className="row g-4 text-center">
                    <div className="col-md-12">
                        <Image
                            src="/assets/images/logo.png"
                            className="rounded-3 mb-4"
                            alt="Wrny Logo"
                            width={100}
                            height={100}
                            priority
                        />
                    </div>
                </div>

                {aboutHtml ? (
                    <div className="row mb-4">
                        <div className="col-md-10 mx-auto">
                            <div dangerouslySetInnerHTML={{ __html: aboutHtml }} />
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}


