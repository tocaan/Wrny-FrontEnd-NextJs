// utils/countries.js
"use client";
import { useEffect, useState } from "react";
import api from "@/utils/api";

let _countriesCache = null;
let _countriesError = null;
let _countriesPromise = null;
const LS_KEY = "app:countries:v1";

function readFromLS() {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(LS_KEY);
        const parsed = raw ? JSON.parse(raw) : null;
        return Array.isArray(parsed) ? parsed : null;
    } catch {
        return null;
    }
}

function writeToLS(data) {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(LS_KEY, JSON.stringify(data));
    } catch { }
}

async function fetchCountriesOnce() {
    if (_countriesCache) return _countriesCache;
    if (_countriesPromise) return _countriesPromise;

    _countriesPromise = api
        .get("/countries")
        .then(({ data }) => {
            const list = Array.isArray(data?.data) ? data.data : [];
            _countriesCache = list;
            _countriesError = null;
            writeToLS(list);
            return list;
        })
        .catch((e) => {
            _countriesError =
                e?.response?.data?.message || "Failed to load countries";
            throw e;
        })
        .finally(() => {
            _countriesPromise = null;
        });

    return _countriesPromise;
}

export function useCountries() {
    // ثابت أثناء الـ hydration: يمنع الاختلاف بين SSR/Client
    const [countries, setCountries] = useState([]);   // لا تقرأ من LS هنا
    const [loading, setLoading] = useState(true);     // ابدأ دايمًا true
    const [err, setErr] = useState(null);

    useEffect(() => {
        let mounted = true;

        // جرّب ذاكرة الموديول أولاً
        if (_countriesCache) {
            if (!mounted) return;
            setCountries(_countriesCache);
            setErr(null);
            setLoading(false);
            return;
        }

        // جرّب localStorage بعد mount (مش قبل كده)
        const ls = readFromLS();
        if (ls && mounted) {
            _countriesCache = ls; // عشان المكونات التانية تقراه فورًا
            setCountries(ls);
            setErr(null);
            setLoading(false);
            // ممكن لسه نعمل refresh من السيرفر لو عايز:
            // (اختياري) fetchCountriesOnce().catch(()=>{});
            return;
        }

        // مافيش كاش؟ هات من الشبكة
        fetchCountriesOnce()
            .then((list) => {
                if (!mounted) return;
                setCountries(list);
                setErr(null);
            })
            .catch(() => {
                if (!mounted) return;
                setErr(_countriesError || "Failed to load countries");
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    return { countries, loading, err };
}
