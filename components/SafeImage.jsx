'use client';
import Image from 'next/image';
import { useMemo } from 'react';

export default function SafeImage({ src, ...props }) {
  const unoptimized = useMemo(() => {
    if (typeof src === 'string' && /^https?:\/\//i.test(src)) return true;
    return false;
  }, [src]);

  return <Image src={src} unoptimized={unoptimized} referrerPolicy="no-referrer" {...props} onError={(e)=>{ e.currentTarget.src='/assets/images/placeholder.svg'; }} />;
}
