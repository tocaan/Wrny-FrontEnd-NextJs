'use client';

import { useState, useEffect, useMemo } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import { usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LogIn, Search, UserRound } from 'lucide-react';
import { isUserLoggedIn } from '@/utils/auth';
function normalize(path) {
    if (!path) return '/';
    let p = path.split('#')[0].split('?')[0];
    if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
}

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const locale = useLocale();
    const t = useTranslations('navbar');
    const pathnameRaw = usePathname();
    const pathname = useMemo(() => normalize(pathnameRaw), [pathnameRaw]);

    const isActive = (href, { exact = false } = {}) => {
        const target = normalize(href);
        if (exact) return pathname === target;
        if (pathname === target) return true;
        if (target !== '/' && pathname.startsWith(`${target}/`)) return true;
        return false;
    };

    const [isSticky, setIsSticky] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(isUserLoggedIn());
    }, []);

    return (
        <>
            <header className={`navbar-light header-sticky ${isSticky ? 'header-sticky-on' : ''}`}>
                <nav className="navbar navbar-expand-xl">
                    <div className="container">
                        <Link className="navbar-brand" href="/">
                            <img
                                className="light-mode-item navbar-brand-item"
                                src="/assets/images/logo.png"
                                alt="logo"
                            />
                        </Link>
                        <button
                            className="navbar-toggler mx-2 mx-sm-0 p-0 p-sm-2"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse"
                            aria-expanded="false"
                            aria-controls="navbarCollapse"
                        >
                            <span className="navbar-toggler-animation">
                                <span></span>
                                <span></span>
                                <span></span>
                            </span>
                        </button>

                        <div className="navbar-collapse collapse" id="navbarCollapse">
                            <ul className="navbar-nav navbar-nav-scroll mx-auto">
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/', { exact: true }) ? 'active' : ''}`}
                                        href="/"
                                    >
                                        {t('home')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/about', { exact: true }) ? 'active' : ''}`}
                                        href="/about"
                                    >
                                        {t('about')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/categories') ? 'active' : ''}`}
                                        href="/categories"
                                    >
                                        {t('categories')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/companies') ? 'active' : ''}`}
                                        href="/companies"
                                    >
                                        {t('companies')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/events') ? 'active' : ''}`}
                                        href="/events"
                                    >
                                        {t('events')}
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${isActive('/contact', { exact: true }) ? 'active' : ''}`}
                                        href="/contact"
                                    >
                                        {t('contact')}
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <ul className="nav flex-row align-items-center list-unstyled mx-xl-auto d-none d-sm-flex">
                            {/* Language */}
                            <li className="nav-item ms-2 d-none d-sm-block">
                                <LanguageSwitcher />
                            </li>
                            {/* Account */}
                            {isLoggedIn && (
                                <li className="nav-item ms-2 d-none d-sm-block">
                                    <Link className="nav-link mb-0 py-0" href="/profile">
                                        <UserRound size={22} className="fs-5" />
                                    </Link>
                                </li>
                            )}
                            {/* Search */}
                            <li className="nav-item dropdown nav-search mx-2 d-none d-sm-flex">
                                <a
                                    className="nav-link mb-0 py-0"
                                    role="button"
                                    href="#"
                                    id="navSearch"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    data-bs-auto-close="outside"
                                    data-bs-display="static"
                                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                                >
                                    <Search size={22} />
                                </a>
                                <div
                                    className={`dropdown-menu dropdown-menu-end shadow rounded p-2 ${isSearchOpen ? 'show' : ''
                                        }`}
                                    aria-labelledby="navSearch"
                                >
                                    <form className="input-group">
                                        <input
                                            className="form-control border-primary"
                                            type="search"
                                            placeholder="بحث..."
                                            aria-label="Search"
                                        />
                                        <button className="btn btn-primary m-0" type="submit">
                                            بحث
                                        </button>
                                    </form>
                                </div>
                            </li>
                            {/* Login */}
                            {!isLoggedIn && (
                                <li className="nav-item ms-2 d-none d-sm-block">
                                    <Link href="/login" className="btn btn-sm btn-primary-soft mb-0">
                                        <LogIn
                                            className={`${locale === 'ar' ? 'ms-2' : 'me-2'}`}
                                            size={16}
                                            absoluteStrokeWidth={true}
                                        />
                                        {t('login')}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>
            </header>

            <div id="sticky-space" style={{ height: isSticky ? '100px' : '0px' }} className={`${isSticky ? 'active' : ''}`}></div>
        </>
    );
}
