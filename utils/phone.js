// utils/phone.js
export function normalizeCountryCode(input) {
    if (!input) return "";
    const digits = String(input).replace(/\D+/g, ""); // remove non-digits
    if (digits.startsWith("00")) return digits.slice(2);
    return digits;
}
