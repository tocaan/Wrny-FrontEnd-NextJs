'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

const LanguageSwitcher = () => {
    const { locale } = useParams();
    const t = useTranslations('navbar');
    const toggleLanguage = (e) => {
        e.preventDefault();
        const newLang = locale === 'ar' ? 'en' : 'ar';
        localStorage.setItem('LANG', newLang);
        window.location.reload();
    };

    return (
        <a
            className="nav-link mb-0 py-0"
            role="button"
            href="#"
            onClick={toggleLanguage}
        >
            <i className="bi bi-translate fs-5"></i> {t('language')}
        </a>
    );
};

export default LanguageSwitcher;
