import Providers from '@/helpers/Provider';
import { Almarai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import BootstrapClient from '@/helpers/bootstrap-client';
import { Toaster } from 'react-hot-toast';
import 'tiny-slider/dist/tiny-slider.css';
import SplashScreen from '@/components/SplashScreen';

async function loadLocaleStyles(locale) {
  if (locale === 'ar') {
    await import('@/public/assets/css/style-ar.css');
  } else {
    await import('./globals.css');
  }
}

const almarai = Almarai({
  subsets: ['arabic'],
  weight: ['300', '400', '700', '800'],
  display: 'swap',
  variable: '--font-almarai',
});

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    viewportFit: 'cover',
    themeColor: '#ffffff',
  };
  
  export const metadata = {
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
    },
  };

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  const messages = await getMessages();
  await loadLocaleStyles(locale);

  return (
    <Providers>
      <html
        lang={locale}
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={almarai.variable}
        suppressHydrationWarning
      >
        <head>
          <link rel="preload" as="image" href="/assets/images/logo.png" />
          <style>{`
            body.splash-active::before {
              content: '';
              position: fixed;
              inset: 0;
              z-index: 2147483647;
              background: #fff url('/assets/images/logo.png') center center / 180px no-repeat;
              opacity: 1;
              transition: opacity .22s ease;
            }

            body.splash-active.splash-hiding::before { opacity: 0; }

            body.splash-active { overflow: hidden; }

            @media (prefers-reduced-motion: reduce) {
              body.splash-active::before { transition: none; }
            }
          `}</style>
        </head>
        <body className="has-navbar-mobile splash-active" suppressHydrationWarning>
          <Toaster position={locale === 'ar' ? 'top-left' : 'top-right'} />
          <BootstrapClient />
          <NextIntlClientProvider messages={messages}>
            <SplashScreen minDuration={1300} />
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </Providers>
  );
}
