'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';

import { useEffect } from "react";
import { useParams, useRouter, usePathname } from "next/navigation";
// import { LocalKeys } from "@/helpers/Config";
// import { getDirection } from "@/helpers/Helpers";

export default function Providers({ children }) {


    const router = useRouter();

    const { locale } = useParams();

    const pathname = usePathname();

    // const dir = getDirection(locale);

    // useEffect(() => {
    // 	document.documentElement.dir = dir;
    // }, [dir]);

    useEffect(() => {

        const lang = localStorage.getItem('LANG');

        if (lang) {
            router.push(`/${lang}/${pathname.slice(3)}`);
        } else {
            localStorage.setItem('LANG', locale);
        }

    }, [])

    return <Provider store={store}>
        {children}
        </Provider>;
}
