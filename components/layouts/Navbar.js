'use client';

import { useState, useEffect, useMemo } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import { usePathname } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { LogIn, UserRound } from 'lucide-react';
import { isUserLoggedIn } from '@/utils/auth';
import BackButton from '../ui/BackButton';

function normalize(path) {
  if (!path) return '/';
  let p = path.split('#')[0].split('?')[0];
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

export default function Navbar() {
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
    const handleScroll = () => setIsSticky(window.scrollY > 200);
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
            {/* Brand */}
            <Link className="navbar-brand" href="/">
              <img
                className="light-mode-item navbar-brand-item"
                src="/assets/images/logo.png"
                alt="logo"
              />
            </Link>

            {/* === Mobile: Language instead of bars (toggler removed) === */}
            <div className="mx-2 mx-sm-0 p-0 p-sm-2 d-xl-none">
              <LanguageSwitcher />
            </div>

            {/* Desktop menu (xl and up) */}
            <div className="navbar-collapse collapse d-none d-xl-block" id="navbarCollapse">
              <ul className="navbar-nav navbar-nav-scroll mx-auto">
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/', { exact: true }) ? 'active' : ''}`} href="/">
                    {t('home')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className={`nav-link ${isActive('/about', { exact: true }) ? 'active' : ''}`} href="/about">
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
                  <Link className={`nav-link ${isActive('/contact', { exact: true }) ? 'active' : ''}`} href="/contact">
                    {t('contact')}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Right actions (desktop only) */}
            <ul className="nav flex-row align-items-center list-unstyled mx-xl-auto d-none d-xl-flex">
              {/* Language (desktop) */}
              <li className="nav-item ms-2">
                <LanguageSwitcher />
              </li>

              {/* Account */}
              {isLoggedIn && (
                <li className="nav-item ms-2">
                  <Link className="nav-link mb-0 py-0" href="/profile">
                    <UserRound size={22} className="fs-5" />
                  </Link>
                </li>
              )}

              {/* Login */}
              {!isLoggedIn && (
                <li className="nav-item ms-2">
                  <Link href="/login" className="btn btn-sm btn-primary-soft mb-0">
                    <span className={locale === 'ar' ? 'ms-2' : 'me-2'}>
                      <LogIn size={16} absoluteStrokeWidth />
                    </span>
                    {t('login')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </nav>
      </header>

      <BackButton mobileOnly preferReplaceOnFallback hideOnHome={true} width="25%" important  size="btn-md" className={`btn-light text-gray py-3 mt-3 ${locale === 'ar' ? 'me-4' : 'ms-3'} rounded-3`} />
      <div id="sticky-space" style={{ height: isSticky ? '100px' : '0px' }} className={isSticky ? 'active' : ''} />
    </>
  );
}
