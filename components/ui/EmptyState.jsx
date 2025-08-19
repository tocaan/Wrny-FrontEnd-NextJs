"use client";

import React from "react";
import Link from "next/link";

/**
 * EmptyState
 * Props:
 * - title: string
 * - description?: string | ReactNode
 * - icon?: ReactNode
 * - illustration?: ReactNode
 * - actions?: Array<{ label: string, onClick?: () => void, href?: string, variant?: 'primary'|'outline'|'secondary'|'danger', size?: 'sm'|'md' }>
 * - size?: 'sm' | 'md' | 'lg'
 * - compact?: boolean
 * - className?: string
 * - centered?: boolean
 */
export default function EmptyState({
  title = "لا توجد بيانات",
  description,
  icon,
  illustration,
  actions = [],
  size = "md",
  compact = false,
  centered = true,
  className = "",
}) {
  const sizeClasses = {
    sm: "p-3",
    md: "p-4 p-md-5",
    lg: "p-4 p-md-5 py-6",
  }[size];

  const wrapper = `
    card border-0 ${centered ? "text-center" : ""}
    ${compact ? "" : "shadow-sm"}
    ${className}
  `.trim();

  const iconWrap = `
    d-inline-flex align-items-center justify-content-center
    rounded-circle bg-light border
    ${size === "lg" ? "p-3" : "p-2"}
    mb-3
  `;

  const btnClass = (v = "primary", s = "sm") =>
    `btn btn-${v === "outline" ? "outline-primary" : v} btn-${s} me-2 mb-2`;

  return (
    <div className={wrapper} role="status" aria-live="polite">
      <div className={`card-body ${sizeClasses}`}>
        {illustration && <div className="mb-3">{illustration}</div>}

        {!illustration && icon && <div className={iconWrap}>{icon}</div>}

        <h5 className="mb-2">{title}</h5>

        {description && (
          <div className="text-muted mb-3 small">{description}</div>
        )}

        {!!actions.length && (
          <div className={centered ? "d-flex justify-content-center flex-wrap" : ""}>
            {actions.map((a, idx) =>
              a.href ? (
                <Link
                  key={idx}
                  href={a.href}
                  className={btnClass(a.variant, a.size || "sm")}
                >
                  {a.label}
                </Link>
              ) : (
                <button
                  key={idx}
                  type="button"
                  className={btnClass(a.variant, a.size || "sm")}
                  onClick={a.onClick}
                >
                  {a.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
