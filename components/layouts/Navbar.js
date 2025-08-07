'use client';

import { useState, useEffect } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import { usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

export default function Navbar() {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const pathname = usePathname();
    const locale = useLocale();
    const t = useTranslations('nav');

    const isActive = (href) => {
        return pathname === `/${locale}${href}` || pathname.startsWith(`/${locale}${href}/`);
    };

    return (
        <header className="navbar-light header-sticky">
            <nav className="navbar navbar-expand-xl">
                <div className="container">
                    <Link className="navbar-brand" href="/">
                        <img className="light-mode-item navbar-brand-item" src="/assets/images/logo.png" alt="logo" />
                    </Link>
                    <button
                        className="navbar-toggler mx-2 mx-sm-0 p-0 p-sm-2"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarCollapse"
                        aria-controls="navbarCollapse"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
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
                                <Link className={`nav-link ${isActive('') ? 'active' : ''}`} href="/">
                                    {t('home')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/about') ? 'active' : ''}`} href="/about">
                                    {t('about')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/categories') ? 'active' : ''}`} href="/categories">
                                    {t('categories')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/companies') ? 'active' : ''}`} href="/companies">
                                    {t('companies')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/events') ? 'active' : ''}`} href="/events">
                                    {t('events')}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} href="/contact">
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
                        {/* Account Profile */}
                        <li className="nav-item ms-2 d-none d-sm-block">
                            <Link className="nav-link mb-0 py-0" href="/account">
                                <i className="bi bi-person-circle fs-5"></i>
                            </Link>
                        </li>
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
                                <i className="bi bi-search fs-5"> </i>
                            </a>
                            <div className={`dropdown-menu dropdown-menu-end shadow rounded p-2 ${isSearchOpen ? 'show' : ''}`} aria-labelledby="navSearch">
                                <form className="input-group">
                                    <input className="form-control border-primary" type="search" placeholder="بحث..." aria-label="Search" />
                                    <button className="btn btn-primary m-0" type="submit">
                                        بحث
                                    </button>
                                </form>
                            </div>
                        </li>
                        {/* Sign In button */}
                        <li className="nav-item ms-2 d-none d-sm-block">
                            <Link href="/login" className="btn btn-sm btn-primary-soft mb-0">
                                <i className="fa-solid fa-right-to-bracket mx-2"></i>
                                تسجيل دخول
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </header>
    );
}
