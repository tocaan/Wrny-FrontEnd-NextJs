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

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(isUserLoggedIn());
    }, []);

    const onLogout = async () => {
        try {
            await api.delete("sign-out");
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            dispatch(logout());
            if (typeof window !== "undefined") {
                localStorage.removeItem("token");
                document.cookie = "auth_token=; Max-Age=0; Path=/; SameSite=Lax";
            }
            toast.success(t("toasts.logged_out"));
            router.push("/login");
        }
    };

    return (
        <div>
            <footer className="bg-dark pt-5 mt-5 text-center">
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
                            <p className="my-3 text-white w-60 lh-lg excerpt-20">ورني هو دليلك الشامل لاكتشاف الوجهات والأماكن مثل الحدائق العامة، المعالم السياحية، أماكن القراءة والمكتبات العامة، مراكز التسوق، الأماكن الترفيهية، والأحداث والفعاليات في الكويت.</p>
                        </div>
                    </div>
                    <div className="row mt-1">
                        <ul className="list-inline text-primary-hover lh-lg">
                            <li className="list-inline-item"><Link href="/" className={`text-body-secondary ${isActive('/', { exact: true }) ? 'active' : ''}`}>{t('home')}</Link></li>
                            <li className="list-inline-item"><Link href="/about" className={`text-body-secondary ${isActive('/about', { exact: true }) ? 'active' : ''}`}>{t('about')}</Link></li>
                            <li className="list-inline-item"><Link href="/categories" className={`text-body-secondary ${isActive('/categories', { exact: true }) ? 'active' : ''}`}>{t('categories')}</Link></li>
                            <li className="list-inline-item"><Link href="/companies" className={`text-body-secondary ${isActive('/companies', { exact: true }) ? 'active' : ''}`}>{t('companies')}</Link></li>
                            <li className="list-inline-item"><Link href="/events" className={`text-body-secondary ${isActive('/events', { exact: true }) ? 'active' : ''}`}>{t('events')}</Link></li>
                            <li className="list-inline-item"><Link href="/contact" className={`text-body-secondary ${isActive('/contact', { exact: true }) ? 'active' : ''}`}>{t('contact')}</Link></li>

                        </ul>
                    </div>
                    <div className="row g-4 justify-content-center mt-0">
                        <div className="col-sm-5 col-md-6 col-lg-3">
                            <ul className="list-inline mb-0 mt-0">
                                <li className="list-inline-item">
                                    <Link className="btn btn-sm px-2 bg-facebook mb-0" href="#">
                                        <FaFacebookF className='text-white' />
                                    </Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link className="btn btn-sm shadow px-2 bg-instagram mb-0" href="#">
                                        <FaInstagram className='text-white' />
                                    </Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link className="btn btn-sm shadow px-2 bg-twitter mb-0" href="#">
                                        <FaTwitter className='text-white' />
                                    </Link>
                                </li>
                                <li className="list-inline-item">
                                    <Link className="btn btn-sm shadow px-2 bg-linkedin mb-0" href="#">
                                        <FaLinkedin className='text-white' />
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
                                    تم التصميم والتطوير بواسطة <Link href="https://tocaan.com" className="text-body-secondary">شركة توكان</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <div className="back-top"></div>

            <nav className="navbar navbar-mobile">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/', { exact: true }) ? 'active' : ''}`} href="/">
                            <i className="bi bi-house-door fa-fw"></i>
                            <span className="mb-0 nav-text">{t('home')}</span>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={`nav-link ${isActive('/events', { exact: true }) ? 'active' : ''}`} href="/events">
                            <i className="bi bi-calendar-event fa-fw"></i>
                            <span className="mb-0 nav-text">{t('events')}</span>
                        </Link>
                    </li>
                    {isLoggedIn && (
                        <>
                            <li className="nav-item">
                                <Link className={`nav-link ${isActive('/profile', { exact: true }) ? 'active' : ''}`} href="/profile">
                                    <i className="bi bi-person-circle fa-fw"></i>
                                    <span className="mb-0 nav-text">{t('account')}</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <button className="nav-link text-danger" onClick={onLogout}>
                                    {/* <i className="fas fa-sign-out-alt fa-fw mx-2" /> */}
                                    <LogOut size={20} />
                                    {/* <span className="mb-0 nav-text">{t("nav.logout")}</span> */}
                                    <span className="mb-0 nav-text">تسجيل خروج</span>
                                </button>
                            </li>
                        </>
                    )}

                    {!isLoggedIn && (
                        <li className="nav-item">
                            <Link className={`nav-link ${isActive('/login', { exact: true }) ? 'active' : ''}`} href="/login">
                                <i className="bi bi-box-arrow-in-right fa-fw"></i>
                                <span className="mb-0 nav-text">{t('login')}</span>
                            </Link>
                        </li>
                    )}
                    <li className="nav-item">
                        <Link className="nav-link" href="#" onClick={toggleLanguage}>
                            <i className="bi bi-translate fa-fw"></i>
                            <span className="mb-0 nav-text">{lang === 'ar' ? 'English' : 'العربية'}</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}


