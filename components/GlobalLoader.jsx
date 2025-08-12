// components/GlobalLoader.tsx
'use client';

import { usePathname } from '@/i18n/routing';
import { useState, useEffect } from 'react';

export default function GlobalLoader() {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        // كل ما المسار يتغير → أظهر اللودينج
        setLoading(true);

        // أوقف اللودينج بعد شوية (لما الصفحة تجهز)
        const timeout = setTimeout(() => setLoading(false), 500); // تقدر تزود الوقت
        return () => clearTimeout(timeout);
    }, [pathname]);

    if (!loading) return null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(255,255,255,0.9)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
            }}
        >
            <div className="spinner-border text-primary" role="status" aria-label="Loading" />
        </div>
    );
}
