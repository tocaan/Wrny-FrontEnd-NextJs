'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SwiperSlider from './ui/SwiperSlider';
import { usePathname } from '@/i18n/routing';
import SafeImage from './SafeImage';

export default function HeroSection({ slides = [] }) {
    const t = useTranslations();
    const pathname = usePathname();
    if (!Array.isArray(slides) || slides.length === 0) return null;
    return (
        <div className="hero-slider overflow-hidden">
            <SwiperSlider
                key={`${pathname}-${slides.length}`}
                uniqueId="hero-slider"
                data={slides}
                renderItem={(slide) => (
                    <div className="card overflow-hidden h-400px h-sm-600px rounded-0 text-center position-relative">
                        <SafeImage 
                            src={slide.image} 
                            alt={slide.title || 'Hero slide'} 
                            width={1200} 
                            height={600} 
                            style={{
                                objectFit: 'cover',
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                zIndex: 1
                            }}
                        />
                        <div className="bg-overlay bg-dark opacity-6" style={{ zIndex: 2 }} />
                        <div className="card-img-overlay d-flex align-items-center" style={{ zIndex: 3 }}>
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
                    slidesPerView: 1,
                    spaceBetween: 0,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    loop: true,
                    breakpoints: {
                        // تعطيل breakpoints للـ hero لأنه دائماً slide واحد
                    }
                }}
                showNavigation={true}
                showPagination={false}
                className="hero-swiper"
            />
        </div>
    );
}
