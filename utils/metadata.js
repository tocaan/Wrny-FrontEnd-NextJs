import { getTranslations } from 'next-intl/server';

export async function createPageMetadata(locale, titleKey, params = {}) {
    const t = await getTranslations({ locale });

    const pageTitle = t(`page_titles.${titleKey}`, params);
    const siteName = t('app.title');
    const description = t('app.description');

    return {
        title: `${pageTitle} - ${siteName}`,
        description: description,
        manifest: '/manifest.webmanifest',
        themeColor: '#ffffff',
    };
}
