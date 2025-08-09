import Providers from '@/helpers/Provider';
import { Almarai } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Layout from '@/components/layouts/Layout';
import BootstrapClient from '@/helpers/bootstrap-client';
import 'tiny-slider/dist/tiny-slider.css';
import GlobalLoader from '@/components/GlobalLoader';
import PageHead from '@/components/Head';

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


export default async function RootLayout({ children, params }) {
    const resolvedParams = await params;
    const locale = resolvedParams.locale;
    const messages = await getMessages();
    await loadLocaleStyles(locale);

    return (
        <Providers>
            <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={almarai.variable} suppressHydrationWarning={true}>
                <body className='has-navbar-mobile' suppressHydrationWarning={true}>
                    <GlobalLoader />
                    <BootstrapClient />
                    <NextIntlClientProvider messages={messages}>
                        <Layout>
                            {children}
                        </Layout>
                    </NextIntlClientProvider>
                </body>
            </html>
        </Providers>
    );
}
