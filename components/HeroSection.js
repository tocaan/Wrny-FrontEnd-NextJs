'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Slider from './ui/Slider';
import { usePathname } from '@/i18n/routing';

export default function HeroSection({ slides = [] }) {
    const t = useTranslations();
    const pathname = usePathname();
    if (!Array.isArray(slides) || slides.length === 0) return null;
    return (
        <div className="tiny-slider arrow-round arrow-blur arrow-hover overflow-hidden">
            <Slider
                key={`${pathname}-${slides.length}`}
                data={slides}
                renderItem={(slide) => (
                    <div
                        className="card overflow-hidden h-400px h-sm-600px rounded-0 text-center"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                        }}
                    >
                        <div className="bg-overlay bg-dark opacity-6" />
                        <div className="card-img-overlay d-flex align-items-center">
                            <div className="container w-100 my-auto">
                                <div className="row justify-content-center">
                                    <div className="col-11 col-lg-8">
                                        {/* <h1 className="text-white ff-l mb-5 h2">
                                            {t('hero.title')}
                                        </h1>
                                        <Link href={slide.link || '/categories'} className="btn btn-color mb-0">
                                            {t('hero.explore')}
                                        </Link> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                options={{
                    items: 1,
                    slideBy: 'page',
                    autoplay: true,
                    autoplayButtonOutput: false,
                    controls: true,
                    nav: false,
                    loop: true,
                    gutter: 0,
                    arrowKeys: true,
                }}
            />
        </div>
    );
}
