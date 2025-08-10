"use client";

import { useEffect } from "react";
import { usePathname, useParams, useRouter } from "next/navigation";

// نفس القوائم اللي كانت في الميدل وير، مع دعم المسارات الفرعية
const PROTECTED = [
    /^\/(ar|en)\/account(\/|$)?/,
    /^\/(ar|en)\/profile(\/|$)?/,
];

const GUEST_ONLY = [
    /^\/(ar|en)\/login(\/|$)?/,
    /^\/(ar|en)\/register(\/|$)?/,
    /^\/(ar|en)\/forgot(\/|$)?/,
    /^\/(ar|en)\/verify-phone(\/|$)?/,
    /^\/(ar|en)\/reset-password(\/|$)?/,
];

export default function AuthGate() {
    const pathname = usePathname();
    const { locale = "ar" } = useParams();
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const token = localStorage.getItem("token");
        const hasToken = !!token && token !== "null" && token !== "undefined";

        const isProtected = PROTECTED.some((rx) => rx.test(pathname));
        const isGuestOnly = GUEST_ONLY.some((rx) => rx.test(pathname));

        // لو الصفحة محمية ومفيش توكن → روح للّوجين مع next
        if (isProtected && !hasToken) {
            router.replace(`/${locale}/login?next=${encodeURIComponent(pathname)}`);
            return;
        }

        // لو صفحة ضيوف وفيه توكن → رجّعه للهوم
        if (isGuestOnly && hasToken) {
            router.replace(`/${locale}/`);
            return;
        }
    }, [pathname, locale, router]);

    return null; // ما فيش UI هنا — مجرد حارس
}
