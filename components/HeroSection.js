'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';

export default function HeroSection({ slides }) {
    const sliderRef = useRef(null);
    const t = useTranslations();
    useEffect(() => {
        if (typeof window !== 'undefined' && slides.length > 0) {
            import('tiny-slider-react').then(({ default: TinySlider }) => {
                if (sliderRef.current) {
                    new TinySlider(sliderRef.current, {
                        container: sliderRef.current,
                        items: 1,
                        slideBy: 'page',
                        autoplay: true,
                        controls: true,
                        nav: false,
                        autoplayButtonOutput: false,
                        loop: true,
                        gutter: 0,
                        arrowKeys: true,
                        controlsText: ['<i class="bi bi-arrow-left"></i>', '<i class="bi bi-arrow-right"></i>'],
                    });
                }
            });
        }
    }, [slides]);

    if (slides.length === 0) {
        return null;
    }

    return (
        <section className="py-0 mb-0 home">
            <div className="tiny-slider arrow-round arrow-blur arrow-hover overflow-hidden" ref={sliderRef}>
                {slides.map((slide) => (
                    <div
                        key={slide.id}
                        className="card overflow-hidden h-400px h-sm-600px rounded-0 text-center"
                        style={{
                            backgroundImage: `url(${slide.image})`,
                            backgroundPosition: 'center center',
                            backgroundSize: 'cover',
                        }}
                    >
                        {/* Background dark overlay */}
                        <div className="bg-overlay bg-dark opacity-6"></div>
                        {/* Card image overlay */}
                        <div className="card-img-overlay d-flex align-items-center">
                            <div className="container w-100 my-auto">
                                <div className="row justify-content-center">
                                    <div className="col-11 col-lg-8">
                                        {/* Title */}
                                        <h1 className="text-white ff-l mb-5 h2">
                                            {t('hero.title')}
                                        </h1>
                                        <a href={slide.link || '/categories'} className="btn btn-color mb-0">
                                            {t('hero.explore')}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
