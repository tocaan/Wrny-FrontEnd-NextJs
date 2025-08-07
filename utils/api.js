import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://wrny.tocaan.net/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': (typeof window !== 'undefined' && localStorage.getItem('LANG')) || "en",
    },
});

export default api;
