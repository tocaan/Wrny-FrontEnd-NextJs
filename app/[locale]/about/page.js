import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb';
import { getTranslations } from 'next-intl/server';
import { createPageMetadata } from '@/utils/metadata';

export async function generateMetadata(props) {
    const { locale } = await props.params;
    return createPageMetadata(locale, 'about');
}

export default async function AboutPage({ params }) {
    const locale = params?.locale || 'ar';
    const t = await getTranslations();

    const title = t('pages.about.page_title');
    const lead = t('pages.about.lead');
    const introHeading = t('pages.about.introHeading');
    const introBold = t('pages.about.introBold');
    const introText = t('pages.about.introText');

    return (
        <>
            <Breadcrumb items={[{ name: title }]} />
            <section>
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-xl-10 mx-auto text-center">
                            <h1 className="h3">{lead}</h1>
                            <p className="lead">{t('pages.about.leadSub')}</p>
                        </div>
                    </div>

                    <div className="row g-4 text-center">
                        <div className="col-md-12">
                            <Image
                                src="/assets/images/logo.png"
                                className="rounded-3 mb-4"
                                alt="Wrny Logo"
                                width={200}
                                height={200}
                                priority
                            />
                        </div>
                    </div>

                    <div className="row mb-4 mb-md-5">
                        <div className="col-md-10 mx-auto text-center">
                            <h3 className="mb-4">{introHeading}</h3>
                            <p className="fw-bold">{introBold}</p>
                            <p className="mb-0">{introText}</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
