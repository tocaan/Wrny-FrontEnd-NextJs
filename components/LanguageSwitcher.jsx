'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

const LanguageSwitcher = () => {
    const { locale } = useParams();

    const [lang, setLang] = useState('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('LANG');
        if (storedLang === 'ar') {
            setLang('ar');
        } else {
            setLang('en');
        }
    }, []);

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
            <i className="bi bi-translate fs-5"></i> {lang === 'ar' ? 'English' : 'العربية'}
        </a>
    );
};

export default LanguageSwitcher;
