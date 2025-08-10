import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);


const PROTECTED = [
    /^\/(ar|en)\/account$/,
    /^\/(ar|en)\/profile$/,
    /^\/(ar|en)\/favorite$/,
    /^\/(ar|en)\/delete-account$/,
];


const GUEST_ONLY = [
    /^\/(ar|en)\/login$/,
    /^\/(ar|en)\/register$/,
    /^\/(ar|en)\/forgot$/,
    /^\/(ar|en)\/verify-phone$/,
    /^\/(ar|en)\/reset-password$/
];

export default function middleware(req) {
    const res = intl(req);

    const { pathname } = req.nextUrl;
    const hasAuthToken = !!req.cookies.get("auth_token")?.value;

    const isProtected = PROTECTED.some((rx) => rx.test(pathname));
    const isGuestOnly = GUEST_ONLY.some((rx) => rx.test(pathname));

    if (isProtected && !hasAuthToken) {
        const locale = pathname.split("/")[1] || routing.defaultLocale;
        const url = new URL(`/${locale}/login`, req.url);
        url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
    }

    if (isGuestOnly && hasAuthToken) {
        const locale = pathname.split("/")[1] || routing.defaultLocale;
        const url = new URL(`/${locale}/`, req.url);
        return NextResponse.redirect(url);
    }

    return res;
}

export const config = {
    matcher: ["/", "/(ar|en)/:path*"],
};
