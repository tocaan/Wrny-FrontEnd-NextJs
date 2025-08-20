'use client';
import { useEffect } from 'react';

export default function SplashScreen({ minDuration = 700 }) {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const body = document.body;

    if (!body.classList.contains('splash-active')) return;

    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const waitLoad = new Promise((res) => {
      if (document.readyState === 'complete') return res();
      window.addEventListener('load', res, { once: true });
    });
    const waitTimer = new Promise((res) => setTimeout(res, minDuration));

    Promise.all([waitLoad, waitTimer]).then(() => {
      body.classList.add('splash-hiding');
      setTimeout(() => {
        body.classList.remove('splash-active', 'splash-hiding');
        body.style.overflow = prevOverflow || '';
      }, 240);
    });
  }, [minDuration]);

  return null;
}
