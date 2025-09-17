'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';

export default function SwiperSlider({ 
    data = [], 
    renderItem, 
    options = {},
    showNavigation = true,
    showPagination = false,
    className = "",
    uniqueId = Math.random().toString(36).substr(2, 9)
}) {
    const locale = useLocale();
    const isRTL = locale === 'ar';
    const [showArrows, setShowArrows] = useState(false);
    const [swiperInstance, setSwiperInstance] = useState(null);

    useEffect(() => {
        if (swiperInstance) {
            setShowArrows(calculateShowArrows(swiperInstance));
        }
    }, [data.length, swiperInstance]);

    // إعادة حساب الأسهم عند تغيير حجم الشاشة
    useEffect(() => {
        const handleResize = () => {
            if (swiperInstance) {
                setShowArrows(calculateShowArrows(swiperInstance));
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [swiperInstance]);

    const calculateShowArrows = (swiper) => {
        if (!swiper) return false;
        
        const totalSlides = swiper.slides.length;
        
        let currentSlidesPerView = swiper.params.slidesPerView;
        
        if (currentSlidesPerView === 'auto') {
            currentSlidesPerView = swiper.slidesPerViewDynamic();
        } else {
            const breakpoints = swiper.params.breakpoints || {};
            const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
            
            const sortedBreakpoints = Object.keys(breakpoints)
                .map(Number)
                .sort((a, b) => b - a);
                
            for (const breakpoint of sortedBreakpoints) {
                if (windowWidth >= breakpoint) {
                    currentSlidesPerView = breakpoints[breakpoint].slidesPerView || currentSlidesPerView;
                    break;
                }
            }
        }
        
        return totalSlides > currentSlidesPerView;
    };

    const defaultOptions = {
        modules: [Navigation, Pagination, Autoplay],
        spaceBetween: 16,
        slidesPerView: 1,
        dir: isRTL ? 'rtl' : 'ltr',
        navigation: showNavigation && showArrows ? {
            nextEl: `.swiper-button-next-${uniqueId}`,
            prevEl: `.swiper-button-prev-${uniqueId}`,
        } : false,
        pagination: showPagination ? {
            clickable: true,
            el: `.swiper-pagination-${uniqueId}`
        } : false,
        autoplay: {
            delay: 3000,
            disableOnInteraction: false,
        },
        loop: true,
        breakpoints: {
            576: { slidesPerView: 2 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
        },
        ...options
    };

    if (!Array.isArray(data) || data.length === 0) return null;

    return (
        <div className={`swiper-container ${className} ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            <Swiper 
                {...defaultOptions}
                onSwiper={(swiper) => {
                    setSwiperInstance(swiper);
                    setShowArrows(calculateShowArrows(swiper));
                }}
                onResize={(swiper) => {
                    setShowArrows(calculateShowArrows(swiper));
                }}
                onBreakpoint={(swiper) => {
                    setShowArrows(calculateShowArrows(swiper));
                }}
            >
                {data.map((item, idx) => (
                    <SwiperSlide key={item.id ?? idx}>
                        <div className="h-100">
                            {renderItem ? renderItem(item) : <pre>{JSON.stringify(item)}</pre>}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {showNavigation && showArrows && (
                <>
                    <div className={`swiper-button-prev swiper-button-prev-${uniqueId}`}>
                        {isRTL ? <FaArrowRight size={12} /> : <FaArrowLeft size={12} />}
                    </div>
                    <div className={`swiper-button-next swiper-button-next-${uniqueId}`}>
                        {isRTL ? <FaArrowLeft size={12} /> : <FaArrowRight size={12} />}
                    </div>
                </>
            )}

            {showPagination && (
                <div className={`swiper-pagination swiper-pagination-${uniqueId}`}></div>
            )}
        </div>
    );
}
