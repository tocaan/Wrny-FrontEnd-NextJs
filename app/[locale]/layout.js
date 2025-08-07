import Providers from './Provider';
import { Baloo_Bhaijaan_2 } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import Layout from '@/components/layouts/Layout';

async function loadLocaleStyles(locale) {
    console.log(locale);
    if (locale === 'ar') {
        await import('@/public/assets/css/style-ar.css');
    } else {
        await import('./globals.css');
    }
}

export const metadata = {
    title: 'ورني',
    description: 'تطبيق لاستكشاف الكويت',
};

const baloo = Baloo_Bhaijaan_2({
    subsets: ['arabic'],
    weight: ['400', '500', '600', '700', '800'],
    display: 'swap',
    variable: '--font-baloo',
});

export default async function RootLayout({ children, params: { locale } }) {
    const messages = await getMessages();
    await loadLocaleStyles(locale);

    return (
        <Providers>
            <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={baloo.variable} suppressHydrationWarning={true}>
                <body>
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
