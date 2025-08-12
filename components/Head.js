'use client';

import Head from 'next/head';

export default function PageHead({ title, description }) {
    const appName = 'ورني';
    const pageTitle = title ? `${title} | ${appName}` : appName;
    const pageDescription = description || 'تطبيق لاستكشاف الفاعليات';

    return (
        <Head>
            <title>{pageTitle}</title>
            <meta name="description" content={pageDescription} />
        </Head>
    );
}
