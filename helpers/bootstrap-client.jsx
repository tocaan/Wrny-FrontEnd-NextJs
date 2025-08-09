'use client';
import { useEffect } from 'react';

export default function BootstrapClient() {
  useEffect(() => {
    // dynamic import to avoid SSR issues
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);
  return null;
}
