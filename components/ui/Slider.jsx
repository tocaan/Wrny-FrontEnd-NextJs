'use client';
import { useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import 'tiny-slider/dist/tiny-slider.css';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';
export default function Slider({ data = [], renderItem, options = {} }) {
    const sliderRef = useRef(null);
    const instanceRef = useRef(null);
    const locale = useLocale();
    const isRTL = /^(ar|fa|en|he|ur)(-|$)/i.test(locale || '');
    const leftIcon = renderToStaticMarkup(<ArrowLeft size={20} />);
    const rightIcon = renderToStaticMarkup(<ArrowRight size={20} />);
    useEffect(() => {
        let mounted = true;

        const init = async () => {
            if (!sliderRef.current) return;

            if (instanceRef.current) {
                try { instanceRef.current.destroy(); } catch { }
                instanceRef.current = null;
            }

            const { tns } = await import('tiny-slider/src/tiny-slider');

            requestAnimationFrame(() => {
                if (!mounted || !sliderRef.current) return;

                instanceRef.current = tns({
                    container: sliderRef.current,
                    items: 1,
                    slideBy: 'page',
                    autoplay: true,
                    autoplayButtonOutput: false,
                    controls: true,
                    nav: true,
                    loop: true,
                    gutter: 0,
                    arrowKeys: true,
                    dir: isRTL ? 'rtl' : 'ltr',
                    controlsText: [leftIcon, rightIcon],
                    ...options,
                });
            });
        };

        init();

        return () => {
            mounted = false;
            if (instanceRef.current) {
                try { instanceRef.current.destroy(); } catch { }
                instanceRef.current = null;
            }
        };
    }, [isRTL, JSON.stringify(data), JSON.stringify(options)]);

    return (
        <div ref={sliderRef} className="my-slider">
            {data.map((item, idx) => (
                <div key={item.id ?? idx}>
                    {renderItem ? renderItem(item) : <pre>{JSON.stringify(item)}</pre>}
                </div>
            ))}
        </div>
    );
}
