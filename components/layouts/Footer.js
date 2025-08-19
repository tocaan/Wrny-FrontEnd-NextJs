'use client';
import { Link, usePathname } from '@/i18n/routing';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { FaFacebookF, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { isUserLoggedIn } from '@/utils/auth';
import { LogOut } from 'lucide-react';
import api from '@/utils/api';

function normalize(path) {
  if (!path) return '/';
  let p = path.split('#')[0].split('?')[0];
  if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
  return p || '/';
}

export default function Footer() {
  const t = useTranslations('navbar');
  const y = useTranslations();

  const { locale } = useParams();
  const [lang, setLang] = useState('en');
  const pathnameRaw = usePathname();
  const pathname = useMemo(() => normalize(pathnameRaw), [pathnameRaw]);

  const isActive = (href, { exact = false } = {}) => {
    const target = normalize(href);
    if (exact) return pathname === target;
    if (pathname === target) return true;
    if (target !== '/' && pathname.startsWith(`${target}/`)) return true;
    return false;
  };

  useEffect(() => {
    const storedLang = localStorage.getItem('LANG');
    setLang(storedLang === 'ar' ? 'ar' : 'en');
  }, []);

  const toggleLanguage = (e) => {
    e.preventDefault();
    const newLang = locale === 'ar' ? 'en' : 'ar';
    localStorage.setItem('LANG', newLang);
    window.location.reload();
  };

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    setIsLoggedIn(isUserLoggedIn());
  }, []);

  const onLogout = async () => {
    try {
      await api.delete('sign-out');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      dispatch(logout());
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        document.cookie = 'auth_token=; Max-Age=0; Path=/; SameSite=Lax';
      }
      toast.success(t('toasts.logged_out'));
      router.push('/login');
    }
  };

  return (
    <div>
      {/* ===== Desktop / Tablet footer ONLY ===== */}
      <footer className="bg-dark pt-5 mt-5 text-center d-none d-md-block">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-12">
              <Link href="/">
                <Image
                  height={40}
                  width={160}
                  className="h-40px"
                  src="/assets/images/logo-white.png"
                  alt="logo"
                />
              </Link>
              <p className="my-3 text-white w-60 lh-lg excerpt-20">{y('app.description')}</p>
            </div>
          </div>

          <div className="row mt-1">
            <ul className="list-inline text-primary-hover lh-lg">
              <li className="list-inline-item">
                <Link href="/" className={`text-body-secondary ${isActive('/', { exact: true }) ? 'active' : ''}`}>{t('home')}</Link>
              </li>
              <li className="list-inline-item">
                <Link href="/about" className={`text-body-secondary ${isActive('/about', { exact: true }) ? 'active' : ''}`}>{t('about')}</Link>
              </li>
              <li className="list-inline-item">
                <Link href="/categories" className={`text-body-secondary ${isActive('/categories', { exact: true }) ? 'active' : ''}`}>{t('categories')}</Link>
              </li>
              <li className="list-inline-item">
                <Link href="/companies" className={`text-body-secondary ${isActive('/companies', { exact: true }) ? 'active' : ''}`}>{t('companies')}</Link>
              </li>
              <li className="list-inline-item">
                <Link href="/events" className={`text-body-secondary ${isActive('/events', { exact: true }) ? 'active' : ''}`}>{t('events')}</Link>
              </li>
              <li className="list-inline-item">
                <Link href="/contact" className={`text-body-secondary ${isActive('/contact', { exact: true }) ? 'active' : ''}`}>{t('contact')}</Link>
              </li>
            </ul>
          </div>

          {/* Social (desktop) */}
          <div className="row g-4 justify-content-center mt-0">
            <div className="col-sm-5 col-md-6 col-lg-3">
              <ul className="list-inline mb-0 mt-0">
                <li className="list-inline-item">
                  <Link className="btn btn-sm px-2 bg-facebook mb-0" href="#">
                    <FaFacebookF className="text-white" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link className="btn btn-sm shadow px-2 bg-instagram mb-0" href="#">
                    <FaInstagram className="text-white" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link className="btn btn-sm shadow px-2 bg-twitter mb-0" href="#">
                    <FaTwitter className="text-white" />
                  </Link>
                </li>
                <li className="list-inline-item">
                  <Link className="btn btn-sm shadow px-2 bg-linkedin mb-0" href="#">
                    <FaLinkedin className="text-white" />
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <hr className="mt-4 mb-0" />
          <div className="row">
            <div className="container">
              <div className="d-lg-flex justify-content-center align-items-center py-3 text-center">
                <div className="text-body-secondary text-primary-hover">
                  تم التصميم والتطوير بواسطة{' '}
                  <Link href="https://tocaan.com" className="text-body-secondary">
                    شركة توكان
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    
      <div className="back-top"></div>

      {/* ===== Mobile bottom navbar (ONLY on small screens) ===== */}
      <div style={{ marginTop: '140px' }} className="d-md-none"></div>
      <nav className="navbar navbar-mobile d-md-none">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className={`nav-link ${isActive('/', { exact: true }) ? 'active' : ''}`} href="/">
              <i className="bi bi-house-door fa-fw" />
              <span className="mb-0 nav-text">{t('home')}</span>
            </Link>
          </li>

          <li className="nav-item">
            <Link className={`nav-link ${isActive('/events', { exact: true }) ? 'active' : ''}`} href="/events">
              <i className="bi bi-calendar-event fa-fw" />
              <span className="mb-0 nav-text">{t('events')}</span>
            </Link>
          </li>

          {isLoggedIn ? (
            <>
              <li className="nav-item">
                <Link className={`nav-link ${isActive('/profile', { exact: true }) ? 'active' : ''}`} href="/profile">
                  <i className="bi bi-person-circle fa-fw" />
                  <span className="mb-0 nav-text">{t('account')}</span>
                </Link>
              </li>
              {/* <li className="nav-item">
                <button className="nav-link text-danger" onClick={onLogout}>
                  <LogOut size={20} />
                  <span className="mb-0 nav-text">تسجيل خروج</span>
                </button>
              </li> */}
            </>
          ) : (
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/login', { exact: true }) ? 'active' : ''}`} href="/login">
                <i className="bi bi-box-arrow-in-right fa-fw" />
                <span className="mb-0 nav-text">{t('login')}</span>
              </Link>
            </li>
          )}
          
          {/* Mobile: Menu (opens offcanvas with full menu + socials) */}
          <li className="nav-item">
            <button
              className="nav-link"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#mobileMenuDrawer"
              aria-controls="mobileMenuDrawer"
            >
              <i className="bi bi-list fa-fw" />
              <span className="mb-0 nav-text">{t('menu') || 'Menu'}</span>
            </button>
          </li>

        </ul>
      </nav>

      {/* ===== Offcanvas Drawer (Mobile Menu + Social + Language) ===== */}
      <div
        className="offcanvas offcanvas-bottom rounded-top-4 d-md-none"
        tabIndex="-1"
        id="mobileMenuDrawer"
        aria-labelledby="mobileMenuDrawerLabel"
        style={{ height: '75vh' }}
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="mobileMenuDrawerLabel">
            {t('menu') || 'Menu'}
          </h5>
          <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>

        <div className="offcanvas-body">
        {/* Links */}
        <div className="list-group list-group-flush mb-4">
            <Link href="/" className={`list-group-item list-group-item-action ${isActive('/', { exact: true }) ? 'active' : ''}`}>
                {t('home')}
            </Link>
            <Link href="/about" className={`list-group-item list-group-item-action ${isActive('/about', { exact: true }) ? 'active' : ''}`}>
                {t('about')}
            </Link>
            <Link href="/categories" className={`list-group-item list-group-item-action ${isActive('/categories') ? 'active' : ''}`}>
                {t('categories')}
            </Link>
            <Link href="/companies" className={`list-group-item list-group-item-action ${isActive('/companies') ? 'active' : ''}`}>
                {t('companies')}
            </Link>
            <Link href="/events" className={`list-group-item list-group-item-action ${isActive('/events') ? 'active' : ''}`}>
                {t('events')}
            </Link>
            <Link href="/contact" className={`list-group-item list-group-item-action ${isActive('/contact', { exact: true }) ? 'active' : ''}`}>
                {t('contact')}
            </Link>
        </div>

        {/* Social icons (from footer) */}
        <div className="d-flex justify-content-center gap-2 mb-4">
        <Link className="btn btn-sm px-2 bg-facebook mb-0" href="#">
            <FaFacebookF className="text-white" />
        </Link>
        <Link className="btn btn-sm shadow px-2 bg-instagram mb-0" href="#">
            <FaInstagram className="text-white" />
        </Link>
        <Link className="btn btn-sm shadow px-2 bg-twitter mb-0" href="#">
            <FaTwitter className="text-white" />
        </Link>
        <Link className="btn btn-sm shadow px-2 bg-linkedin mb-0" href="#">
            <FaLinkedin className="text-white" />
        </Link>
        </div>

        {/* Language switch (same behavior as footer toggle) */}
        <div className="text-center">
        <button className="btn btn-outline-primary" onClick={toggleLanguage}>
            <i className="bi bi-translate me-2" />
            {lang === 'ar' ? 'English' : 'العربية'}
        </button>
        </div>
        </div>
      </div>
    </div>
  );
}
