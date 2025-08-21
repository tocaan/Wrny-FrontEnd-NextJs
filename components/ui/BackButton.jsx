'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function BackButton({
  fallback,
  className = '',
  variant = 'btn-outline-secondary',
  size = 'btn-sm',
  icon = true,
  children,
  onClick,
  disabled = false,

  fullWidth = false,
  width,
  minWidth,
  maxWidth,
  style,
  important = false,

  hideOnHome = true,

  preferReplaceOnFallback = true,
  backCheckDelay = 400,
  backSecondChanceDelay = 900,

  // 👇 الجديد هنا
  mobileOnly = false,        // يظهر على الموبايل فقط (يخفي من md وطالع)
  showFrom,                  // بديل: يظهر من breakpoint وطالع (sm|md|lg|xl|xxl)
  hideOnMobile = false,      // قديم: يخفي على الموبايل ويظهر من md وطالع
  hideFrom,                  // يخفي من breakpoint وطالع (مثلاً 'lg' → d-lg-none)

  ...rest
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [busy, setBusy] = useState(false);
  const btnRef = useRef(null);

  const normalizedPath = useMemo(() => {
    if (!pathname) return '/';
    let p = pathname.split('#')[0].split('?')[0];
    if (p !== '/' && p.endsWith('/')) p = p.slice(0, -1);
    return p || '/';
  }, [pathname]);

  const computedFallback = useMemo(() => {
    if (fallback) return fallback;
    const home = locale ? `/${locale}` : '/';
    return home.replace(/\/+$/, '') || '/';
  }, [fallback, locale]);

  const isHome = useMemo(
    () => normalizedPath === `/${locale}` || normalizedPath === '/',
    [normalizedPath, locale]
  );
  const hiddenOnHome = hideOnHome && isHome;

  const dir = useMemo(() => (locale === 'ar' ? 'rtl' : 'ltr'), [locale]);
  const label = useMemo(() => (children ? children : locale === 'ar' ? 'رجوع' : 'Back'), [children, locale]);
  const Icon = dir === 'rtl' ? ArrowRight : ArrowLeft;

  const toCssSize = (v) => (typeof v === 'number' ? `${v}px` : v);

  useEffect(() => {
    if (!important || hiddenOnHome || !btnRef.current) return;
    const el = btnRef.current;
    ['width', 'min-width', 'max-width'].forEach((prop) => { try { el.style.removeProperty(prop); } catch {} });
    if (fullWidth) el.style.setProperty('width', '100%', 'important');
    else if (width != null) el.style.setProperty('width', toCssSize(width), 'important');
    if (minWidth != null) el.style.setProperty('min-width', toCssSize(minWidth), 'important');
    if (maxWidth != null) el.style.setProperty('max-width', toCssSize(maxWidth), 'important');
  }, [important, hiddenOnHome, fullWidth, width, minWidth, maxWidth]);

  const handleClick = useCallback((e) => {
    if (disabled || busy) return;
    setBusy(true);
    try { onClick?.(e); } catch {}

    const before = typeof window !== 'undefined'
      ? window.location.pathname + window.location.search + window.location.hash
      : '';

    router.back();

    const firstTimer = setTimeout(() => {
      if (typeof window === 'undefined') return;
      const now = window.location.pathname + window.location.search + window.location.hash;
      if (now === before) {
        if (preferReplaceOnFallback) router.replace(computedFallback);
        else router.push(computedFallback);
      } else {
        setTimeout(() => {
          const after = window.location.pathname + window.location.search + window.location.hash;
          if (after === before) {
            if (preferReplaceOnFallback) router.replace(computedFallback);
            else router.push(computedFallback);
          }
        }, backSecondChanceDelay);
      }
    }, backCheckDelay);

    setTimeout(() => setBusy(false), Math.max(400, backCheckDelay + 50));
    return () => clearTimeout(firstTimer);
  }, [disabled, busy, onClick, router, computedFallback, preferReplaceOnFallback, backCheckDelay, backSecondChanceDelay]);

  const computedStyle = { ...style };
  if (!important) {
    if (fullWidth) computedStyle.width = '100%';
    else if (width != null) computedStyle.width = toCssSize(width);
    if (minWidth != null) computedStyle.minWidth = toCssSize(minWidth);
    if (maxWidth != null) computedStyle.maxWidth = toCssSize(maxWidth);
  }

  // 👇 التحكم في الظهور/الإخفاء حسب المقاس (Bootstrap)
  const responsiveVisibilityClass = useMemo(() => {
    // يظهر من breakpoint وطالع
    if (showFrom) return `d-none d-${showFrom}-inline-flex`;

    // يظهر فقط على الموبايل (ويختفي من md وما فوق)
    if (mobileOnly) return 'd-inline-flex d-md-none';

    // إخفاء على الموبايل (قديمة)
    if (hideOnMobile) return 'd-none d-md-inline-flex';

    // إخفاء من breakpoint وطالع (مثلاً hideFrom="lg" → d-lg-none)
    if (hideFrom) return `d-inline-flex d-${hideFrom}-none`;

    return 'd-inline-flex';
  }, [showFrom, mobileOnly, hideOnMobile, hideFrom]);

  if (hiddenOnHome) return null;

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={handleClick}
      className={`btn ${variant} ${size} align-items-center gap-2 ${fullWidth && !important ? 'w-100' : ''} ${responsiveVisibilityClass} ${className}`}
      aria-label={typeof label === 'string' ? label : 'Back'}
      disabled={disabled || busy}
      style={computedStyle}
      {...rest}
    >
      {icon && <Icon size={18} aria-hidden="true" />}
      <span>{label}</span>
    </button>
  );
}
