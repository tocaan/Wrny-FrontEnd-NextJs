"use client";

export default function SubmitButton({
    loading,
    label,
    className = "",
    disabled = false
}) {
    return (
        <button
            type="submit"
            className={`btn btn-primary w-100 mb-0 d-inline-flex align-items-center justify-content-center gap-2 ${className}`}
            disabled={loading || disabled}
            aria-busy={loading ? "true" : "false"}
            aria-live="polite"
        >
            {/* سبينر صغير أثناء التحميل */}
            {loading && (
                <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                />
            )}
            <span>{!loading && (label)}</span>
            {loading && <span className="visually-hidden">Loading</span>}
        </button>
    );
}
