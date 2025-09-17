'use client';
import { useMemo } from 'react';
import { useLocale } from 'next-intl';

export default function GoogleMap({ 
    lat, 
    lng, 
    width = "100%", 
    height = 300,
    zoom = 15,
    markerColor = "red",
    title = "Location Map",
    className = "",
    style = {}
}) {
    const locale = useLocale();

    const mapUrl = useMemo(() => {
        if (!lat || !lng) return null;
        
        const baseUrl = 'https://maps.google.com/maps';
        const params = new URLSearchParams({
            q: `${lat},${lng}`,
            hl: locale === 'ar' ? 'ar' : 'en',
            z: zoom.toString(),
            output: 'embed',
            iwloc: 'near'
        });

        return `${baseUrl}?${params.toString()}`;
    }, [lat, lng, locale, zoom]);

    if (!mapUrl) {
        return null;
    }

    const defaultStyle = {
        border: 0,
        borderRadius: '8px',
        ...style
    };

    return (
        <div className={`google-map-container ${className}`} style={{ position: 'relative', ...style }}>
            <iframe
                src={mapUrl}
                width={width}
                height={height}
                style={defaultStyle}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={title}
                sandbox="allow-scripts allow-same-origin allow-forms"
            />
            <a
                href={`https://www.google.com/maps/search/${lat},${lng}/@${lat},${lng},${zoom}z`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-sm position-absolute"
                style={{
                    top: '10px',
                    right: locale === 'ar' ? '10px' : 'auto',
                    left: locale === 'ar' ? 'auto' : '10px',
                    zIndex: 1000,
                    fontSize: '12px',
                    padding: '4px 8px'
                }}
                title={locale === 'ar' ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
            >
                <i className="bi bi-arrows-fullscreen me-1"></i>
                {locale === 'ar' ? 'عرض أكبر' : 'View Larger'}
            </a>
        </div>
    );
}
