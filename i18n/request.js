import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
    // Await the requestLocale property (not calling it as a function)
    const locale = await requestLocale;

    if (!routing.locales.includes(locale)) notFound();

    // Return both messages and locale as required in next-intl 3.22
    return {
        messages: (await import(`../messages/${locale}.json`)).default,
        locale
    };
});
